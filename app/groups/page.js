"use client";

import { useState, useEffect } from "react";
import Table from "../components/Table";
import Modal from "../components/Modal";
import Button from "../components/Button";
import MessageBox from "../components/MessageBox";
import NotAuthorized from "../components/NotAuthorized";
import { isFromCategory } from "../utils/role";
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchPrivateData, postPrivateData } from "../utils/api";
import { useAuth } from "../providers/AuthProvider";

const GroupManagement = () => {
  const [turmas, setTurmas] = useState([]);
  const [filteredTurmas, setFilteredTurmas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTurma, setEditingTurma] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    ano_letivo_id: "",
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { getToken } = useAuth();
  const itemsPerPage = 10;
  const [errorMessage, setErrorMessage] = useState(null);
  const { user, isLoading } = useAuth();
  const [isReady, setIsReady] = useState(false);
  const [years, setYears] = useState([]);
  const [filteredYears, setFilteredYears] = useState([]);
  const token = getToken();

  useEffect(() => {
    const fetchTurmas = async () => {
      if (user !== null && isFromCategory(user, "Admin")) {
        try {
          const data = await fetchPrivateData("turma/turmas", token);
          setTurmas(data);
          setFilteredTurmas(data);
        } catch (error) {
          setErrorMessage("Erro ao buscar turmas: " + error.message);
        }
      }
    };
    fetchTurmas();
  }, [token, user]);

  useEffect(() => {
    const fetchYears = async () => {
      if (user !== null && isFromCategory(user, "Admin")) {
        try {
          const data = await fetchPrivateData("anoletivo/anos", token);
          const openYears = data.filter((year) => year.status === "Aberto");
          setYears(openYears);
          setFilteredYears(openYears);
        } catch (error) {
          setErrorMessage("Erro ao buscar anos letivos: " + error.message);
        }
      }
    };
    fetchYears();
  }, [token, user]);

  useEffect(() => {
    const filtered = turmas.filter(
      (turma) =>
        turma.nome.toLowerCase().includes(search.toLowerCase()) ||
        turma.descricao.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredTurmas(filtered);
    setPage(1);
  }, [search, turmas]);

  const handleEdit = (turma) => {
    setEditingTurma(turma);
    setFormData({
      nome: turma.nome,
      descricao: turma.descricao,
      ano_letivo_id: turma.anoLetivo?.id || "",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const response = await postPrivateData(
        "turma/turma",
        {
          id: editingTurma?.id || null,
          nome: formData.nome,
          descricao: formData.descricao,
          ano_letivo_id: formData.ano_letivo_id,
        },
        token
      );
      if (editingTurma) {
        setTurmas(turmas.map((t) => (t.id === response.id ? response : t)));
      } else {
        setTurmas([...turmas, response]);
      }
      setModalOpen(false);
      setEditingTurma(null);
    } catch (error) {
      setErrorMessage("Erro ao salvar turma: " + error.message);
    }
  };

  const totalPages = Math.ceil(filteredTurmas.length / itemsPerPage);
  const currentPageData = filteredTurmas.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  useEffect(() => {
    if (!isLoading) {
      setIsReady(true);
    }
  }, [isLoading]);

  if (!isReady) return <LoadingSpinner />;
  if (user === null || !isFromCategory(user, "Admin")) return <NotAuthorized />;

  return (
    <div className="container mx-auto p-4">
      {errorMessage && (
        <MessageBox
          message={errorMessage}
          color="detail-subtle"
          onClose={() => setErrorMessage(null)}
        />
      )}

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gerenciamento de Turmas</h1>
        <Button
          label="Adicionar Turma"
          onClick={() => {
            setEditingTurma(null);
            setFormData({ nome: "", descricao: "", ano_letivo_id: "" });
            setModalOpen(true);
          }}
        />
      </div>

      <Table
        headers={["Nome", "Descricao", "Ano Letivo"]}
        data={currentPageData.map((turma) => ({
          nome: turma.nome,
          descricao: turma.descricao,
          ano_letivo: turma.anoLetivo?.ano_letivo || "N/A",
          anoLetivo: turma.anoLetivo,
          id: turma.id,
        }))}
        actions={[
          { label: "Editar", color: "bg-yellow-500", onClick: handleEdit },
        ]}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        searchValue={search}
        onSearch={setSearch}
      />

      <Modal
        title={editingTurma ? "Editar Turma" : "Adicionar Turma"}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      >
        <div>
          <label className="block mb-2 text-sm font-medium">
            Nome:
            <input
              type="text"
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
              }
              className="w-full px-3 py-2 border rounded"
            />
          </label>
          <label className="block mb-2 text-sm font-medium">
            Descrição:
            <input
              type="text"
              value={formData.descricao}
              onChange={(e) =>
                setFormData({ ...formData, descricao: e.target.value })
              }
              className="w-full px-3 py-2 border rounded"
            />
          </label>
          <label className="block mb-2 text-sm font-medium">
            Ano Letivo:
            <select
              value={formData.ano_letivo_id}
              onChange={(e) =>
                setFormData({ ...formData, ano_letivo_id: e.target.value })
              }
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Selecione um ano letivo</option>
              {filteredYears.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.ano_letivo}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Modal>
    </div>
  );
};

export default GroupManagement;
