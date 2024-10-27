import React, { FunctionComponent } from "react";
import { Skeleton } from "@mui/material";
import styles from "@styles/dashboard.module.css";

const PortfolioSummarySkeleton: FunctionComponent = () => {
  return (
    <>
      <div className="w-[90%] md:w-[47%]">
        <Skeleton
          variant="rounded"
          height={'27vh'}
          sx={{
            bgcolor: "grey.900",
            borderRadius: "8px",
            margin: "20px auto",
            padding: "40px",
          }}
        />

      </div>
    </>
  );
};

export default PortfolioSummarySkeleton;