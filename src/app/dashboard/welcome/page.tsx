import {
  StepMenu,
  StepMenuContent,
  StepMenuFooter,
  StepMenuHeader,
  StepMenuNextTrigger,
  StepMenuPreviousTrigger,
  StepMenuProgressBar,
  StepMenuStep,
} from "@/components/custom/step-menu";

import styles from "./styles.module.css";

export default function Welcome() {
  return (
    <div className={styles.page}>
      <StepMenu totalSteps={3} className={styles.container}>
        <StepMenuHeader>
          <h1 className={styles.title}>Menu</h1>
        </StepMenuHeader>
        <StepMenuContent className={styles.content}>
          <StepMenuStep step={1}>
            <p className={styles.text}>Step 1</p>
          </StepMenuStep>
          <StepMenuStep step={2}>
            <p className={styles.text}>Step 2</p>
          </StepMenuStep>
          <StepMenuStep step={3}>
            <p className={styles.text}>Step 3</p>
          </StepMenuStep>
        </StepMenuContent>
        <StepMenuProgressBar variant="line" />
        <StepMenuFooter className={styles.footer}>
          <StepMenuPreviousTrigger variant={"outline"}>
            Previous
          </StepMenuPreviousTrigger>
          <StepMenuNextTrigger>Next</StepMenuNextTrigger>
        </StepMenuFooter>
      </StepMenu>
    </div>
  );
}
