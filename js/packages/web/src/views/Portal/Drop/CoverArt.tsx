import React, { useState, useEffect } from 'react';
import { Dropzone } from 'components';
import { Text, Image, Button, Flex } from '@chakra-ui/react';
import { getLast } from 'utils';

import { IMetadataExtension, MetadataFile } from '@oyster/common';

const CoverArt = (props: {
  attributes: IMetadataExtension;
  setAttributes: (attr: IMetadataExtension) => void;
  files: File[];
  setFiles: (files: File[]) => void;
  confirm: () => void;
}) => {
  const [coverFilePreview, setCoverFilePreview] = useState<string>('');
  const [coverFile, setCoverFile] = useState<File | undefined>(
    props.files?.[0],
  );

  useEffect(() => {
    props.setAttributes({
      ...props.attributes,
      properties: {
        ...props.attributes.properties,
        files: [],
      },
    });
  }, []);

  const handleOnCoverArtDrop = acceptedFiles => {
    const file = acceptedFiles[0];
    if (file) {
      setCoverFilePreview(URL.createObjectURL(acceptedFiles[0]));
      setCoverFile(file);
    }
  };

  const disableContinue = !coverFile;

  return (
    <>
      <Text mb={2}>Upload your cover art</Text>
      {/* <Text>
        Your file will be uploaded to the decentralized web via Arweave.
        Depending on file type, can take up to 1 minute. Arweave is a new type
        of storage that backs data with sustainable and perpetual endowments,
        allowing users and developers to truly store data forever – for the very
        first time.
      </Text> */}
      {/* STEFAN(TODO) limit input types */}
      <Dropzone onDrop={handleOnCoverArtDrop}>
        {coverFile && <Image src={coverFilePreview} width={300} height={300} />}
        {/* <MusicCard {...songDetails} /> */}
      </Dropzone>

      <Button
        size="large"
        disabled={disableContinue}
        onClick={() => {
          props.setAttributes({
            ...props.attributes,
            properties: {
              ...props.attributes.properties,
              files: [coverFile]
                .filter(f => f)
                .map(f => {
                  const uri = typeof f === 'string' ? f : f?.name || '';
                  const type =
                    typeof f === 'string' || !f
                      ? 'unknown'
                      : f.type || getLast(f.name.split('.')) || 'unknown';

                  return {
                    uri,
                    type,
                  } as MetadataFile;
                }),
            },
            image: coverFile?.name || '',
            // animation_url: mainFile && mainFile.name,
          });
          // props.setFiles([coverFile, mainFile].filter(f => f) as File[]);
          props.setFiles([coverFile].filter(f => f) as File[]);
          props.confirm();
        }}
        style={{ marginTop: 24 }}
        className="action-btn"
      >
        Continue to Audio File
      </Button>
    </>
  );
};

export default CoverArt;
