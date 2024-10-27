import React, { FunctionComponent, useCallback, useContext, useEffect, useState } from "react";
import AppIcon from "@components/UI/appIcon";
import { TEXT_TYPE } from "@constants/typography";
import Typography from "@components/UI/typography/typography";
import { Doughnut } from "react-chartjs-2";
import styles from "@styles/dashboard.module.css";
import { Chart, ArcElement, DoughnutController, Tooltip } from 'chart.js';
import cursor from '../../public/icons/cursor.png';
import cursorPointer from '../../public/icons/pointer-cursor.png';

Chart.register(ArcElement, DoughnutController, Tooltip);

type PortfolioSummaryProps = {
  title: string,
  data: ChartItem[],
  totalBalance: number,
  isProtocol: boolean,
  isLoading: boolean
}

const ChartItem: FunctionComponent<ChartItem> = ({
  color,
  itemLabel,
  itemValue,
  itemValueSymbol
}) => {
  const value = itemValueSymbol === '%' ? itemValue + itemValueSymbol : itemValueSymbol + itemValue;
  return (
    <div className="flex w-full justify-between my-1">
      <div className="flex flex-row w-full items-center gap-2">
        <svg width={16} height={16}>
          <circle cx="50%" cy="50%" r="8" fill={color} />
        </svg>
        <Typography type={TEXT_TYPE.BODY_MIDDLE}>{itemLabel}</Typography>
      </div>
      <Typography type={TEXT_TYPE.BODY_MIDDLE}>{value}</Typography>
    </div>
  );
};

const PortfolioSummary: FunctionComponent<PortfolioSummaryProps> = ({ title, data, totalBalance, isProtocol, isLoading }) => {
  const normalizeMinValue = (data: ChartItem[], minPercentage: number) => {
    return data.map(entry => Number(entry.itemValue) < totalBalance * minPercentage ? (totalBalance * minPercentage).toFixed(2) : entry.itemValue)
  }

  return data.length > 0 ? (
    <div className={styles.dashboard_portfolio_summary}>
      <div className="flex flex-row w-full justify-between items-center mb-4">
        <Typography type={TEXT_TYPE.BUTTON_LARGE} style={{ textAlign: "left", width: "fit-content", lineHeight: "2.75rem" }}>
          {title}
        </Typography>
        {isProtocol ?
          <button
            onClick={() => { }}
            className="flex flex-row items-center justify-evenly gap-4 bg-white rounded-xl modified-cursor-pointer h-min lg:mt-2 mt-8 px-6 py-1.5"
          >
            <AppIcon app="starknet" className="w-5 h-5" />
            <Typography type={TEXT_TYPE.BUTTON_SMALL} color="background">
              Claim your reward
            </Typography>
          </button>
          :
          <></>
        }
      </div>
      <div className={styles.dashboard_portfolio_summary_info}>
        <div className="flex flex-col justify-between w-8/12 h-fit">
          {
            data.map((item, id) => (
              <ChartItem
                key={id}
                color={item.color}
                itemLabel={item.itemLabel}
                itemValue={item.itemValue}
                itemValueSymbol={item.itemValueSymbol}
              />
            ))
          }
        </div>
        <div className="w-3/12">
          <Doughnut
            data={{
              labels: data.map(entry => entry.itemLabel),
              datasets: [{
                label: '',
                data: normalizeMinValue(data, .05),
                backgroundColor: data.map(entry => entry.color),
                borderColor: data.map(entry => entry.color),
                borderWidth: 1,
              }],
            }}
            options={{
              elements: {
                arc: {
                  borderAlign: "inner",
                  borderRadius: 3,
                  spacing: 1,
                  hoverOffset: 1,
                  hoverBorderColor: "white",
                  hoverBorderWidth: 1
                }
              },
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                tooltip: {
                  position: "nearest",
                  xAlign: "center",
                  yAlign: "top",
                  callbacks: {
                    label: function (tooltipItem) {
                      return `${data[tooltipItem.dataIndex].itemValueSymbol}${data[tooltipItem.dataIndex].itemValue}`;
                    }
                  }
                }
              },
              onHover: (event, element) => {
                let canvas = event.native?.target as HTMLCanvasElement;
                canvas.style.cursor = element[0] ? `url(${cursorPointer.src}), pointer` : `url(${cursor.src}), auto`;
              }
            }}
          />
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default PortfolioSummary;
