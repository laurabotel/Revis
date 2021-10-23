import React, { ReactElement } from "react";
import GridLayout from "react-grid-layout";
import { useStore } from "../../../context/Provider";
import MultipleGraph from "./MultipleGraph";
import LeftMenuOfGraph from "./LeftMenuOfGraph";
import styles from "../../../styles/GraphContainer.module.scss";
import { Context } from "../../../context/interfaces";

function MultipleGraphContainer() {
  const { multipleGraphSelections, metricsStore }: Context = useStore();
  const arrayWithGraphs: ReactElement[] = [];

  const data = metricsStore.metricState;

  let i = 0;
  const layouts = { 0: [0, 0], 1: [10, 0], 2: [0, 10], 3: [10, 10] };

  Object.keys(multipleGraphSelections.multipleGraphState).forEach((key) => {
    if (multipleGraphSelections.multipleGraphState[key]) {
      arrayWithGraphs.push(
        <div
          key={i}
          data-grid={{ x: layouts[i][0], y: layouts[i][0], w: 6, h: 1.2 }}
        >
          <MultipleGraph metricValue={data} metricName={key} />
        </div>
      );
    }
    i += 1;
  });

  return (
    <div  className={styles.MultipleGraphContainer}>
      <div>
        <LeftMenuOfGraph />
      </div>
      <div className={styles.GraphFlex}>
        <GridLayout rowHeight={300} width={800}>
          {arrayWithGraphs}
        </GridLayout>
      </div>
    </div>
  );
}
export default MultipleGraphContainer;
