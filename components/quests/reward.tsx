import React, { FunctionComponent, useCallback, useState } from "react";
import styles from "../../styles/quests.module.css";
import Button from "../UI/button";
import ModalMessage from "../UI/modalMessage";
import { useAccount, useContractWrite } from "@starknet-react/core";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import verifiedLottie from "../../public/visuals/verifiedLottie.json";
import { Call } from "starknet";
import { useNotificationManager } from "../../hooks/useNotificationManager";
import {
  NotificationType,
  TransactionType,
} from "../../constants/notifications";
import { CDNImg } from "../cdn/image";

type RewardProps = {
  onClick: () => void;
  reward: string;
  imgSrc: string;
  disabled: boolean;
  mintCalldata: Call[] | undefined;
  questName: string;
};

const Reward: FunctionComponent<RewardProps> = ({
  onClick,
  reward,
  imgSrc,
  disabled,
  mintCalldata,
  questName,
}) => {
  const [modalTxOpen, setModalTxOpen] = useState(false);
  const { address } = useAccount();
  const { addTransaction } = useNotificationManager();
  const { writeAsync: executeMint } = useContractWrite({
    calls: mintCalldata,
  });
  const router = useRouter();

  const submitTx = useCallback(async () => {
    if (!address) return;
    const tx = await executeMint();
    onClick();
    addTransaction({
      timestamp: Date.now(),
      subtext: questName,
      type: NotificationType.TRANSACTION,
      data: {
        type: TransactionType.MINT_NFT,
        hash: tx.transaction_hash,
        status: "pending",
      },
    });
    setModalTxOpen(true);
  }, [executeMint, address]);

  return (
    <div className={styles.reward}>
      <div className="flex">
        <p className="mr-1">Reward: </p>
        <CDNImg width={25} src={imgSrc} />
        <p className="ml-1">{reward}</p>
      </div>
      <div className="max-w-lg">
        {/* getReward */}
        <Button onClick={submitTx} disabled={disabled}>
          Get Reward
        </Button>
      </div>

      <ModalMessage
        open={modalTxOpen}
        title="Your NFT is on it's way !"
        closeModal={() => setModalTxOpen(false)}
        message={
          <div className="mt-7 flex flex-col items-center justify-center text-center">
            <Lottie
              className="w-52"
              animationData={verifiedLottie}
              loop={false}
            />
            <div className="mt-4">
              <Button onClick={() => router.push("/")}>
                Complete another quest !
              </Button>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default Reward;
