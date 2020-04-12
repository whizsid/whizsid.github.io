import React, { PureComponent } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import atomDark from "react-syntax-highlighter/dist/esm/styles/prism/atom-dark";

interface CodeBlockProps {
    language: string;
    value: string;
}

class CodeBlock extends PureComponent<CodeBlockProps> {

  static defaultProps = {
    language: null
  };

  render() {
    const { language, value } = this.props;
    return (
      <div style={{maxWidth:"100%", overflowX: "auto"}}>
        <SyntaxHighlighter language={language} style={atomDark}>
          {value}
        </SyntaxHighlighter>
      </div>
    );
  }
}

export default CodeBlock;