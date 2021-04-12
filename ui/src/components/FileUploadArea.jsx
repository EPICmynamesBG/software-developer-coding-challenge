import * as React from 'react';
import { DropzoneArea } from 'material-ui-dropzone';

function FileUploadArea(props) {
  const { onChange = () => {} } = props;


  const handleChange = (fileList) => {
    console.log(fileList);
    onChange({
      target: {
        id: props.inputProps.id,
        value: fileList
      }
    });
  };

  return (
    <div>
      <DropzoneArea
        acceptedFiles={['image/*']}
        dropzoneText={"Drag and drop an image here or click"}
        {...props}
        onChange={handleChange}
      />
    </div>
  )
}

export default FileUploadArea;
