import { useState } from "react";
import { documentsData } from "../../shared/data/profileDummyData";
import { DigitalDocument } from "../../shared/types/profile.types";

export function useDocuments() {
  const [documents] = useState<DigitalDocument[]>(documentsData);
  const [isLoading, setIsLoading] = useState(false);

  return {
    documents,
    rawCount: documents.length,
    isLoading,
    setIsLoading,
  };
}
