"use client";

import { useState, useEffect } from "react";
import Table from "../components/Table";
import Modal from "../components/Modal";
import Button from "../components/Button";
import MessageBox from "../components/MessageBox";
import NotAuthorized from "../components/NotAuthorized";
import { isFromCategory } from "../../utils/role";
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchPrivateData, postPrivateData } from "../../utils/api"; // Import das funções
import { useAuth } from "../../providers/AuthProvider";

const AcademicYearManagement = () => {
  const [years, setYears] = useState([]);
  const [filteredYears, setFilteredYears] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingYear, setEditingYear] = useState(null);
  const [formData, setFormData] = useState({ ano_letivo: "", aberto: false });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { getToken, isLoggingOut } = useAuth();
  const itemsPerPage = 10;
  const [errorMessage, setErrorMessage] = useState(null); // Armazena o erro para exibir
  const { user, isLoading } = useAuth(); // Supondo que você tem um estado isLoading
  const [isReady, setIsReady] = useState(false); //
  const token = getToken(); // Obtendo o token do armazenamento local.

  useEffect(() => {
    const fetchYears = async () => {
      if (user !== null && isFromCategory(user, "Admin")) {
        try {
          const data = await fetchPrivateData("anoletivo/anos", token);
          setYears(data);
          setFilteredYears(data);
        } catch (error) {
          setErrorMessage(
            "Erro ao buscar anos letivos: " + error.response.data.errors[0]
          );
        }
      }
    };
    fetchYears();
  }, [token, user]);

  useEffect(() => {
    // Filtro de busca dinâmica
    const filtered = years.filter(
      (year) =>
        year.ano_letivo.toString().includes(search) ||
        year.status.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredYears(filtered);
    setPage(1); // Resetar para a primeira página ao aplicar filtro
  }, [search, years]);

  const handleEdit = (year) => {
    setEditingYear(year);
    setFormData({
      ano_letivo: year.ano_letivo,
      aberto: year.status === "Aberto",
    });
    setModalOpen(true);
  };

  const handleDelete = async (year) => {
    try {
      await postPrivateData("anoletivo/ano", { ...year, aberto: false }, token);
      setYears(years.filter((y) => y.id !== year.id));
    } catch (error) {
      setErrorMessage(
        "Erro ao deletar ano letivo: " + error.response.data.errors[0]
      );
    }
  };

  const handleSave = async () => {
    try {
      const response = await postPrivateData(
        "anoletivo/ano",
        {
          id: editingYear?.id || null,
          ano_letivo: formData.ano_letivo,
          aberto: formData.aberto,
        },
        token
      );
      if (editingYear) {
        setYears(years.map((y) => (y.id === response.id ? response : y)));
      } else {
        setYears([...years, response]);
      }
      setModalOpen(false);
      setEditingYear(null);
    } catch (error) {
      setErrorMessage(
        "Erro ao salvar ano letivo: " + error.response.data.errors[0]
      );
    }
  };

  // Paginação
  const totalPages = Math.ceil(filteredYears.length / itemsPerPage);
  const currentPageData = filteredYears.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  useEffect(() => {
    // Aguarda o carregamento do usuário
    if (!isLoading) {
      setIsReady(true); // Quando o carregamento for concluído, marca como pronto para renderizar
    }
  }, [isLoading]); // Só vai rodar quando o isLoading mudar

  // Enquanto estiver carregando, exibe o LoadingSpinner
  if (!isReady || isLoggingOut) return <LoadingSpinner />;

  if (user === null || !isFromCategory(user, "Admin")) return <NotAuthorized />;

  return (
    <div className="container mx-auto p-4">
      {errorMessage && (
        <MessageBox
          message={errorMessage}
          color="detail-minor"
          onClose={() => setErrorMessage(null)}
        />
      )}

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gerenciamento de Anos Letivos</h1>
        <Button
          label="Adicionar Ano Letivo"
          onClick={() => {
            setEditingYear(null);
            setFormData({ ano_letivo: "", aberto: false });
            setModalOpen(true);
          }}
        />
      </div>

      <Table
        headers={["Ano Letivo", "Status"]}
        data={currentPageData.map((year) => ({
          ano_letivo: year.ano_letivo,
          status: year.status,
          id: year.id,
        }))}
        actions={[
          { label: "Editar", color: "bg-yellow-500", onClick: handleEdit },
          //{ label: "Remover", color: "bg-red-500", onClick: handleDelete },
        ]}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        searchValue={search}
        onSearch={(value) => {
          setPage(1);
          setSearch(value);
        }}
      />

      <Modal
        title={editingYear ? "Editar Ano Letivo" : "Adicionar Ano Letivo"}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      >
        <div>
          <label className="block mb-2 text-sm font-medium">
            Ano Letivo:
            <input
              type="number"
              value={formData.ano_letivo}
              onChange={(e) =>
                setFormData({ ...formData, ano_letivo: e.target.value })
              }
              className="w-full px-3 py-2 border rounded"
            />
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.aberto}
              onChange={(e) =>
                setFormData({ ...formData, aberto: e.target.checked })
              }
              className="mr-2"
            />
            Aberto
          </label>
        </div>
      </Modal>
    </div>
  );
};

export default AcademicYearManagement;
