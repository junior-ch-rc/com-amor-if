"use client";

import React, { useState, useEffect } from "react";
import { fetchPrivateData } from "../../utils/api";
import { useAuth } from "../../providers/AuthProvider";
import RuleSelect from "./RuleSelect";

const PontuacaoForm = ({ regrasDisponiveis, onSubmit, setErrorMessage }) => {
  const { getToken } = useAuth();
  const [regras, setRegras] = useState(regrasDisponiveis || []);
  const [operacao, setOperacao] = useState(null);
  const [turmas, setTurmas] = useState([]);
  const [formData, setFormData] = useState({
    idTurma: "",
    idRegra: "",
    pontos: "",
    operacao: "",
    motivacao: "",
    matriculaAluno: "",
    bimestre: 0,
    turno: "",
  });
  const [tipoRegra, setTipoRegra] = useState(null);

  // Fetch para buscar as turmas
  useEffect(() => {
    const fetchTurmas = async () => {
      try {
        const token = getToken(); // Obtém o token do usuário
        const data = await fetchPrivateData(
          "turma/turmas/ultimo-ano-letivo",
          token
        );
        setTurmas(data);
      } catch (error) {
        setErrorMessage({
          error: "Erro ao carregar turmas: " + error?.response?.data?.errors[0],
        });
      }
    };
    fetchTurmas();
  }, [getToken]);

  const handleRegraChange = (regraId) => {
    const regraSelecionada = regras.find(
      (regra) => regra.id === parseInt(regraId)
    );
    setTipoRegra(regraSelecionada?.tipoRegra || null);
    setOperacao(regraSelecionada?.operacao || "");
    setFormData({
      ...formData,
      idRegra: regraId,
      operacao: regraSelecionada?.operacao || "",
      pontos: regraSelecionada?.tipoRegra?.fixo
        ? regraSelecionada.valorMinimo
        : "",
      bimestre: regraSelecionada?.tipoRegra?.bimestreExtra ? 4 : 0,
      valorMinimo: regraSelecionada?.valorMinimo || 0,
      valorMaximo: regraSelecionada?.valorMaximo || 500,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, setFormData, setTipoRegra, setOperacao);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Seletor de Regra */}
      <div>
        <label htmlFor="regra" className="block text-sm font-medium text-gray-700">Regra</label>
        <RuleSelect
          rules={regras}
          selectedRuleId={formData.idRegra}
          onChange={handleRegraChange}
        />
      </div>

      {/* Indicativo de operação */}
      {operacao && (
        <div
          className={`mt-2 ${
            operacao === "SUM" ? "text-green-500" : "text-red-500"
          }`}
        >
          <p>
            {operacao === "SUM"
              ? "Operação de adição"
              : "Operação de subtração"}
          </p>
        </div>
      )}

      {/* Select Turma ou Turno */}
      {tipoRegra?.porTurno ? (
        <div>
          <label htmlFor="turno" className="block text-sm font-medium text-gray-700">
            Turno
          </label>
          <select
            id="turno"
            name="turno"
            value={formData.turno}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border rounded"
            required
          >
            <option value="">Selecione um turno</option>
            <option value="0">Matutino</option>
            <option value="1">Vespertino</option>
          </select>
        </div>
      ) : (
        <div>
          <label htmlFor="turma" className="block text-sm font-medium text-gray-700">
            Turma
          </label>
          <select
            id="turma"
            name="idTurma"
            value={formData.idTurma}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border rounded"
            required
          >
            <option value="">Selecione uma turma</option>
            {turmas.map((turma) => (
              <option key={turma.id} value={turma.id}>
                {turma.nome}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Select Bimestre */}
      {(tipoRegra?.frequencia !== 0 || tipoRegra?.bimestreExtra) && (
        <div>
          <label htmlFor="bimestre" className="block text-sm font-medium text-gray-700">
            Bimestre
          </label>
          <select
            id="bimestre"
            name="bimestre"
            value={formData.bimestre}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border rounded"
            required
            disabled={tipoRegra?.bimestreExtra}
          >
            <option value="0">1º Bimestre</option>
            <option value="1">2º Bimestre</option>
            <option value="2">3º Bimestre</option>
            <option value="3">4º Bimestre</option>
            <option value="4">Bimestre Extra</option>
          </select>
        </div>
      )}

      {/* Pontos */}
      {tipoRegra?.fixo ? (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pontos
          </label>
          <p className="mt-1 text-gray-600">
            {formData.pontos} pontos (valor fixo)
          </p>
        </div>
      ) : (
        <div>
          <label htmlFor="pontos" className="block text-sm font-medium text-gray-700">
            Pontos
          </label>
          <input
            id="pontos"
            type="number"
            name="pontos"
            value={formData.pontos}
            onChange={handleInputChange}
            min={formData.valorMinimo || 0}
            max={formData.valorMaximo || 100}
            className="w-full mt-1 p-2 border rounded"
            required
          />
        </div>
      )}

      {/* Matrícula do Aluno */}
      {tipoRegra?.temAluno && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Matrícula do Aluno
          </label>
          <input
            type="text"
            name="matriculaAluno"
            value={formData.matriculaAluno}
            onChange={handleInputChange}
            maxLength={15}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
      )}

      {/* Motivação */}
      <div>
        <label htmlFor="motivacao" className="block text-sm font-medium text-gray-700">
          Motivação
        </label>
        <textarea
          id="motivacao"
          name="motivacao"
          value={formData.motivacao}
          onChange={handleInputChange}
          className="w-full mt-1 p-2 border rounded"
          rows="3"
        ></textarea>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Registrar Pontuação
        </button>
      </div>
    </form>
  );
};

export default PontuacaoForm;
