"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { defaultCms, type CmsContent } from "@/lib/cms";

type CmsContextValue = {
  cms: CmsContent;
  loading: boolean;
  refreshCms: () => Promise<void>;
};

const CmsContext = createContext<CmsContextValue>({
  cms: defaultCms,
  loading: true,
  refreshCms: async () => {},
});

export function CmsProvider({ children }: { children: ReactNode }) {
  const [cms, setCms] = useState<CmsContent>(defaultCms);
  const [loading, setLoading] = useState(true);

  const refreshCms = async () => {
    try {
      const response = await fetch("/api/cms", { cache: "no-store" });
      const data = await response.json();
      if (data?.content) setCms(data.content);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refreshCms(); }, []);

  const value = useMemo(() => ({ cms, loading, refreshCms }), [cms, loading]);
  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  return useContext(CmsContext);
}
