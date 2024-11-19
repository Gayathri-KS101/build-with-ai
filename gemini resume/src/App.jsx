import { useState } from 'react'
import { ChakraProvider, Heading, Text, useToast } from '@chakra-ui/react'
import ResumeUploader from './components/ResumeUploader'
import AnalysisResults from './components/AnalysisResults'
import { analyzeResume } from './services/geminiService'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

function App() {
  const [resumeContent, setResumeContent] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const toast = useToast()

  const handleResumeContent = async (content) => {
    setResumeContent(content)
    setIsAnalyzing(true)
    
    try {
      const result = await analyzeResume(content)
      setAnalysis(result)
      toast({
        title: 'Analysis Complete',
        description: 'Your resume has been analyzed successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Analysis Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      setAnalysis(null)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <ChakraProvider>
      <Heading 
        as="h1" 
        className="app-title"
      >
        Resume Analyzer AI
      </Heading>
      
      <Text fontSize="lg" mb={6} color="white" className="app-description">
        Upload your resume and let AI provide professional insights
      </Text>

      <div className="upload-section">
        <ResumeUploader onResumeContent={handleResumeContent} />
      </div>

      {(resumeContent || isAnalyzing) && (
        <div className="analysis-section">
          <AnalysisResults analysis={analysis} isLoading={isAnalyzing} />
        </div>
      )}
    </ChakraProvider>
  )
}

export default App
