// import classes from './ProgressBar.module.css';

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getStockData } from "../../../utils/http/investing";

type ProgressBarProps = {
  stock: string;
  canSubmit: boolean;
  setCanSubmit: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ProgressBar({
  stock,
  canSubmit,
  setCanSubmit,
}: ProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCanSubmit(true);
      setProgress(0);
    }, 60000);
    return () => clearTimeout(timer);
  }, [canSubmit]);

  const { isFetching } = useQuery({
    queryKey: ["stocks", stock],
    queryFn: () => getStockData(stock),
    gcTime: 1000 * 60 * 60 * 2,
    staleTime: 1000 * 60 * 60 * 2,
    placeholderData: [],
  });

  useEffect(() => {
    if (isFetching) {
      const fillDuration = 15;
      const interval = setInterval(() => {
        setProgress((prevProgress) => prevProgress + 100 / fillDuration);
      }, 1000);
      return () => {
        setProgress(0);
        clearInterval(interval);
      };
    } else if (!canSubmit && !isFetching) {
      const fillDuration = 45;
      const interval = setInterval(() => {
        setProgress((prevProgress) => prevProgress + 100 / fillDuration);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isFetching]);

  return <progress value={progress} max="100" />;
}
