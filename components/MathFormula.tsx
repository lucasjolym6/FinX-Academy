import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

type MathFormulaProps = {
  formula: string;
  inline?: boolean;
};

export default function MathFormula({ formula, inline }: MathFormulaProps) {
  if (inline) {
    return <InlineMath math={formula} />;
  }
  return <BlockMath math={formula} />;
}

