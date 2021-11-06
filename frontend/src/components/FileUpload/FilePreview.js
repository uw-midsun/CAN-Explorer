import React from "react";
import { syntaxHighlight } from "../../utils/jsonUtils";
import "./FilePreview.css";

function FilePreview(props) {
  const {preview} = props;

  const renderHTML = (input) => {
    return <div dangerouslySetInnerHTML={{ __html: input }}></div>;
  };

  return (
    <div style={{ height: 500, overflowY: "scroll" }}>
      {renderHTML("<pre>" + syntaxHighlight(preview) + "</pre>")}
    </div>
  );
}

export default FilePreview;
