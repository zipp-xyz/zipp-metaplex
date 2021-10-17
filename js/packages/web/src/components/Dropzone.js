import React, { useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { Flex } from '@chakra-ui/react';

const PREVIEW_HEIGHT = 300;

const Dropzone = ({ onDrop, children }) => {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: ['image/*', 'audio/*'],
    onDrop: acceptedFiles => {
      onDrop(acceptedFiles);
    },
  });

  const borderColor = useMemo(() => {
    if (isDragActive) return '#2196f3';
    if (isDragAccept) return '#00e676';
    if (isDragReject) return '#ff1744';
  }, [isDragActive, isDragReject, isDragAccept]);

  return (
    <>
      <Flex
        height={PREVIEW_HEIGHT}
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Flex
          {...getRootProps()}
          width="100%"
          minHeight="100%"
          alignItems="center"
          justifyContent="center"
          my="50px"
          border="2px #eee dashed"
          borderRadius={2}
          color="#bdbdbd"
          transition="border .24s ease-in-out"
          borderColor={borderColor}
        >
          <input {...getInputProps()} />
          {children}
        </Flex>
      </Flex>
    </>
  );
};

export default Dropzone;
