import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Text, Progress, useToast } from '@chakra-ui/react';
import { FaFileUpload } from 'react-icons/fa';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const ResumeUploader = ({ onResumeContent }) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const extractTextFromPDF = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + ' ';
      }

      return fullText.trim();
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw error;
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsLoading(true);
    try {
      if (file.type === 'application/pdf') {
        const text = await extractTextFromPDF(file);
        onResumeContent(text);
        toast({
          title: 'Resume uploaded successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: 'Please upload a PDF file',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error processing file',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [onResumeContent, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: false,
  });

  return (
    <Box
      {...getRootProps()}
      w="100%"
      p={10}
      border="2px dashed"
      borderColor={isDragActive ? "blue.400" : "gray.300"}
      borderRadius="lg"
      textAlign="center"
      cursor="pointer"
      transition="all 0.2s"
      _hover={{
        borderColor: 'blue.400',
        transform: 'translateY(-2px)',
        boxShadow: 'md',
      }}
      position="relative"
    >
      <input {...getInputProps()} />
      <FaFileUpload size={40} style={{ margin: '0 auto 1rem', color: '#ffffff' }} />
      <Text color="white" mb={2}>
        {isDragActive
          ? "Drop your resume here..."
          : "Drag and drop your resume here or click to browse"}
      </Text>
      <Text fontSize="sm" color="whiteAlpha.600">
        Supports PDF files
      </Text>
      {isLoading && (
        <Box position="absolute" bottom={4} left={4} right={4}>
          <Progress size="xs" isIndeterminate />
        </Box>
      )}
    </Box>
  );
};

export default ResumeUploader;
