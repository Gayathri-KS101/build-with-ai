import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Spinner,
  Text,
  Heading,
  VStack,
  HStack,
  Container,
  Divider
} from '@chakra-ui/react';
import { FaCode, FaBriefcase, FaGraduationCap, FaStar, FaTools, FaUserTie, FaUserGraduate, FaChartLine } from 'react-icons/fa';
import asianMomImage from '../assets/asian-mom.svg';
import robotImage from '../assets/professional-robot.svg';

const formatContent = (content) => {
  if (!content) return '';
  
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Bold text
    .replace(/\n- /g, '<br>• ')  // Convert "- " to bullet points
    .replace(/\n/g, '<br>')  // Convert other newlines to <br>
    .replace(/•\s+([^•<]+)/g, '• <span class="list-item">$1</span>');  // Style list items
};

const SectionHeading = ({ icon: Icon, title }) => (
  <HStack spacing={2} mb={2}>
    <Icon />
    <Heading size="md">{title}</Heading>
  </HStack>
);

const Section = ({ title, content, icon }) => (
  <Box mb={4} p={4} className="section-content">
    <SectionHeading icon={icon} title={title} />
    <Text className="section-text" whiteSpace="pre-line">{content}</Text>
  </Box>
);

const CharacterImage = ({ src, alt, borderColor, className }) => (
  <Box textAlign="center" mb={4}>
    <img
      src={src}
      alt={alt}
      className={className}
      style={{ 
        width: '200px',
        height: '200px',
        margin: '0 auto',
        borderRadius: '50%',
        border: `4px solid ${borderColor}`,
        background: 'white',
        padding: '10px'
      }}
    />
  </Box>
);

const Perspective = ({ title, sections, isAsianMom }) => (
  <Box
    w="full"
    p={6}
    bg={isAsianMom ? 'rgba(255, 182, 193, 0.15)' : 'rgba(173, 216, 230, 0.15)'}
    borderRadius="xl"
    boxShadow="lg"
    className={isAsianMom ? 'asian-mom-section' : 'professional-section'}
  >
    <VStack spacing={4} align="stretch">
      <Heading 
        size="lg" 
        color={isAsianMom ? 'pink.600' : 'blue.600'} 
        mb={4}
        textAlign="center"
      >
        {title}
      </Heading>
      <CharacterImage 
        src={isAsianMom ? asianMomImage : robotImage}
        alt={isAsianMom ? "Asian Mom" : "Professional Robot"}
        borderColor={isAsianMom ? '#ED64A6' : '#3182CE'}
        className={isAsianMom ? 'asian-mom-image' : 'robot-image'}
      />
      {isAsianMom ? (
        <>
          <Section
            title="Initial Reaction"
            content={sections.initialReaction}
            icon={FaUserTie}
          />
          <Section
            title="Education"
            content={sections.education}
            icon={FaUserGraduate}
          />
          <Section
            title="Experience"
            content={sections.experience}
            icon={FaBriefcase}
          />
          <Section
            title="Skills"
            content={sections.skills}
            icon={FaTools}
          />
          <Section
            title="Areas for Improvement"
            content={sections.improvements}
            icon={FaChartLine}
          />
          <Section
            title="Overall Verdict"
            content={sections.overallVerdict}
            icon={FaStar}
          />
        </>
      ) : (
        <>
          <Section
            title="Skills"
            content={sections.skills}
            icon={FaTools}
          />
          <Section
            title="Experience"
            content={sections.experience}
            icon={FaBriefcase}
          />
          <Section
            title="Education"
            content={sections.education}
            icon={FaUserGraduate}
          />
          <Section
            title="Areas for Improvement"
            content={sections.improvements}
            icon={FaChartLine}
          />
        </>
      )}
    </VStack>
  </Box>
);

const AnalysisResults = ({ analysis, isLoading }) => {
  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" color="white" />
        <Text color="white" mt={4}>Analyzing your resume...</Text>
      </Box>
    );
  }

  console.log("Analysis in component:", analysis);

  if (!analysis) return null;

  return (
    <Container maxW="container.xl" py={8}>
      <HStack spacing={8} align="stretch">
        <Perspective
          title="Asian Mom Says..."
          sections={analysis.asianMom}
          isAsianMom={true}
        />
        <Divider orientation="vertical" />
        <Perspective
          title="Professional Analysis"
          sections={analysis.professional}
          isAsianMom={false}
        />
      </HStack>
    </Container>
  );
};

export default AnalysisResults;
