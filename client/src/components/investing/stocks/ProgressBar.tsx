import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import classes from "./ProgressBar.module.css";
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
  const [fetchStartTime, setFetchStartTime] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCanSubmit(true);
      setProgress(0);
    }, 40000);
    return () => clearTimeout(timer);
  }, [canSubmit]);

  const { isFetching } = useQuery({
    queryKey: ["stocks", stock],
    queryFn: () => {
      setFetchStartTime(Date.now());
      return getStockData(stock);
    },
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
      const fetchingDuration = Date.now() - fetchStartTime!;
      const fillDuration = 39 - fetchingDuration / 1000;
      const interval = setInterval(() => {
        setProgress((prevProgress) => prevProgress + 100 / fillDuration);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isFetching]);

  return <progress className={classes.progress} value={progress} max="100" />;
}
