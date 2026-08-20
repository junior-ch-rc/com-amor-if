"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchPrivateData } from "../../utils/api";
import { getOpenSchoolYear } from "../../utils/schoolYear";

export const useOpenSchoolYear = (token, enabled = true) => {
  const [openSchoolYear, setOpenSchoolYear] = useState(null);
  const [schoolClasses, setSchoolClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!enabled || !token) {
      setOpenSchoolYear(null);
      setSchoolClasses([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const schoolYears = await fetchPrivateData("anoletivo/anos", token);
      const activeYear = getOpenSchoolYear(schoolYears);
      setOpenSchoolYear(activeYear);

      if (activeYear) {
        const classes = await fetchPrivateData(
          "turma/turmas/ultimo-ano-letivo",
          token
        );
        setSchoolClasses(classes);
      } else {
        setSchoolClasses([]);
      }
    } catch (requestError) {
      setOpenSchoolYear(null);
      setSchoolClasses([]);
      setError(
        requestError?.response?.data?.errors?.[0] ||
          "Não foi possível consultar o ano letivo aberto."
      );
    } finally {
      setIsLoading(false);
    }
  }, [enabled, token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    openSchoolYear,
    hasOpenSchoolYear: Boolean(openSchoolYear),
    schoolClasses,
    hasSchoolClasses: schoolClasses.length > 0,
    isLoading,
    error,
    refresh,
  };
};
