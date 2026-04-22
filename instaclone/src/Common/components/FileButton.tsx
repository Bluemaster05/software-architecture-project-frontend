import React from "react";
import Button from "@mui/material/Button";

export default function FileUpload() {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    console.log(file);
  };

  return (
    <Button variant="contained" component="label">
      Upload File
      <input
        type="file"
        hidden
        onChange={handleFileChange}
      />
    </Button>
  );
}