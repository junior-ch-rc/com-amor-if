"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export const UNGROUPED_RULES_LABEL = "Outras regras";

const normalizeSearchValue = (value = "") =>
  (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();

export const groupRulesByCategory = (rules = []) =>
  rules.reduce((groups, rule) => {
    const groupName = rule.categoria?.trim() || UNGROUPED_RULES_LABEL;

    if (!groups[groupName]) groups[groupName] = [];
    groups[groupName].push(rule);

    return groups;
  }, {});

const RuleSelect = ({ rules = [], selectedRuleId, onChange }) => {
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const editingRef = useRef(false);
  const previousSelectedRuleIdRef = useRef(selectedRuleId);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const selectedRule = rules.find((rule) => String(rule.id) === String(selectedRuleId));
  const filteredRules = useMemo(() => {
    const normalizedSearch = normalizeSearchValue(searchTerm);
    return rules.filter((rule) =>
      [rule.descricao, rule.categoria].some((value) =>
        normalizeSearchValue(value).includes(normalizedSearch)
      )
    );
  }, [rules, searchTerm]);
  const groups = Object.entries(groupRulesByCategory(filteredRules));

  useEffect(() => {
    if (selectedRule) {
      setSearchTerm(selectedRule.descricao);
      editingRef.current = false;
    } else if (previousSelectedRuleIdRef.current && !editingRef.current) {
      setSearchTerm("");
    }
    previousSelectedRuleIdRef.current = selectedRuleId;
  }, [selectedRule, selectedRuleId]);

  useEffect(() => {
    inputRef.current?.setCustomValidity(
      selectedRule ? "" : "Selecione uma regra da lista."
    );
  }, [selectedRule]);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
        if (selectedRule) setSearchTerm(selectedRule.descricao);
      }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [selectedRule]);

  const handleSelect = (rule) => {
    editingRef.current = false;
    onChange(String(rule.id));
    setSearchTerm(rule.descricao);
    setIsOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      setSearchTerm(selectedRule?.descricao || "");
      return;
    }
    if (!filteredRules.length) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((current) =>
        (current + direction + filteredRules.length) % filteredRules.length
      );
    }
    if (event.key === "Enter" && isOpen) {
      event.preventDefault();
      handleSelect(filteredRules[activeIndex] || filteredRules[0]);
    }
  };

  return (
    <div className="relative mt-1" ref={containerRef}>
      <input
        ref={inputRef}
        id="regra"
        aria-activedescendant={
          isOpen && filteredRules[activeIndex]
            ? `rule-option-${filteredRules[activeIndex].id}`
            : undefined
        }
        aria-autocomplete="list"
        aria-controls="rule-options"
        aria-expanded={isOpen}
        aria-label="Buscar regra pela descrição ou categoria"
        className="w-full p-2 border rounded"
        onChange={(event) => {
          editingRef.current = true;
          setSearchTerm(event.target.value);
          setActiveIndex(0);
          setIsOpen(true);
          if (selectedRuleId) onChange("");
        }}
        onFocus={() => {
          setActiveIndex(Math.max(0, filteredRules.indexOf(selectedRule)));
          setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
        placeholder="Digite a descrição ou categoria"
        role="combobox"
        type="search"
        value={searchTerm}
        required
      />

      {isOpen && (
        <div
          id="rule-options"
          role="listbox"
          aria-label="Regras disponíveis"
          className="absolute z-10 w-full max-h-72 overflow-y-auto mt-1 bg-white border rounded shadow-lg"
        >
          {groups.length > 0 ? (
            groups.map(([groupName, groupedRules]) => (
              <section key={groupName} aria-label={groupName}>
                <h3 className="px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-100">
                  {groupName}
                </h3>
                {groupedRules.map((rule) => {
                  const ruleIndex = filteredRules.indexOf(rule);
                  return (
                    <button
                      id={`rule-option-${rule.id}`}
                      type="button"
                      role="option"
                      aria-selected={ruleIndex === activeIndex}
                      className={`block w-full px-3 py-2 text-left hover:bg-blue-50 ${
                        ruleIndex === activeIndex ? "bg-blue-50" : ""
                      }`}
                      key={rule.id}
                      onMouseEnter={() => setActiveIndex(ruleIndex)}
                      onClick={() => handleSelect(rule)}
                    >
                      {rule.descricao}
                    </button>
                  );
                })}
              </section>
            ))
          ) : (
            <p className="px-3 py-2 text-gray-600" role="status">
              Nenhuma regra encontrada.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default RuleSelect;
