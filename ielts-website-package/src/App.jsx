import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { ChevronLeft, ChevronRight, Clock, MessageSquare, Settings, HelpCircle, Highlighter, Eraser, NotebookPen, Plus, Edit3, Trash2, Save, X, Upload, Award, FileText, CheckCircle, BookOpen, Library, FolderPlus } from 'lucide-react'
import './App.css'

// Import images
import ieltsLogo from './assets/mxJtdGC877oB.jpg'
import studentsImage from './assets/b8vFnpB0jq5W.jpg'

function App() {
  const [currentPart, setCurrentPart] = useState(1)
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [answers, setAnswers] = useState({})
  const [timeRemaining, setTimeRemaining] = useState(3600) // 60 minutes in seconds
  
  // Enhanced highlighting and note-taking state
  const [highlightingEnabled, setHighlightingEnabled] = useState(false)
  const [highlights, setHighlights] = useState({})
  const [notes, setNotes] = useState({})
  const [showNotes, setShowNotes] = useState(false)
  const [newNote, setNewNote] = useState({ title: '', content: '' })
  const [editingNote, setEditingNote] = useState(null)
  
  // Contextual toolbar state
  const [contextualToolbar, setContextualToolbar] = useState({
    visible: false,
    x: 0,
    y: 0,
    selectedText: '',
    range: null
  })
  
  // Available highlight colors
  const highlightColors = [
    { name: 'yellow', color: '#ffeb3b', label: 'Yellow' },
    { name: 'blue', color: '#2196f3', label: 'Blue' },
    { name: 'green', color: '#4caf50', label: 'Green' },
    { name: 'purple', color: '#9c27b0', label: 'Purple' },
    { name: 'orange', color: '#ff9800', label: 'Orange' },
    { name: 'pink', color: '#e91e63', label: 'Pink' }
  ]
  
  // Test management state
  const [tests, setTests] = useState({})
  const [currentTestId, setCurrentTestId] = useState('default')
  const [showTestManager, setShowTestManager] = useState(false)
  
  // Grading state
  const [showGrading, setShowGrading] = useState(false)
  const [gradingResults, setGradingResults] = useState(null)
  const [showAnswerKey, setShowAnswerKey] = useState(false)
  const [answerKey, setAnswerKey] = useState({})

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => prev > 0 ? prev - 1 : 0)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Initialize test management system
  useEffect(() => {
    const defaultTests = {
      'test-1': {
        id: 'test-1',
        name: 'IELTS Reading Test 1 - Marie Curie',
        description: 'Academic Reading test about the life and work of Marie Curie',
        createdDate: new Date().toISOString(),
        answerKey: {
          1: "FALSE", 2: "NOT GIVEN", 3: "TRUE", 4: "FALSE", 5: "TRUE", 6: "FALSE",
          7: "thorium", 8: "pitchblende", 9: "radium", 10: "soldiers", 11: "illness", 12: "neutron", 13: "leukaemia",
          14: "B", 15: "F", 16: "A", 17: "G",
          18: ["A", "B"], 19: ["C", "D"], 20: ["A", "C"], 21: ["B", "D"], 22: ["A", "D"], 23: ["B", "C"],
          27: "TRUE", 28: "NOT GIVEN", 29: "FALSE", 30: "NOT GIVEN", 31: "TRUE", 32: "NOT GIVEN", 33: "NOT GIVEN",
          34: "language", 35: "shredding", 36: "disappeared", 37: "Order", 38: "revoked", 39: "organisations", 40: "corporations"
        }
      }
    }
    
    setTests(defaultTests)
    setAnswerKey(defaultTests['test-1'].answerKey)
  }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleMultipleAnswerChange = (questionId, value, checked) => {
    setAnswers(prev => {
      const currentAnswers = prev[questionId] || []
      if (checked) {
        return {
          ...prev,
          [questionId]: [...currentAnswers, value]
        }
      } else {
        return {
          ...prev,
          [questionId]: currentAnswers.filter(answer => answer !== value)
        }
      }
    })
  }

  const getQuestionStatus = (questionId) => {
    return answers[questionId] ? 'attempted' : 'not-attempted'
  }

  const getAllNotes = () => {
    return Object.values(notes).sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
  }

  // Grading System Functions
  const defaultAnswerKey = {
    1: "FALSE", 2: "NOT GIVEN", 3: "TRUE", 4: "FALSE", 5: "TRUE", 6: "FALSE",
    7: "thorium", 8: "pitchblende", 9: "radium", 10: "soldiers", 11: "illness", 12: "neutron", 13: "leukaemia",
    14: "B", 15: "F", 16: "A", 17: "G",
    18: ["A", "B"], 19: ["C", "D"], 20: ["A", "C"], 21: ["B", "D"], 22: ["A", "D"], 23: ["B", "C"],
    27: "TRUE", 28: "NOT GIVEN", 29: "FALSE", 30: "NOT GIVEN", 31: "TRUE", 32: "NOT GIVEN", 33: "NOT GIVEN",
    34: "language", 35: "shredding", 36: "disappeared", 37: "Order", 38: "revoked", 39: "organisations", 40: "corporations"
  }

  const downloadAnswerKeyTemplate = () => {
    const template = {
      "1": "TRUE/FALSE/NOT GIVEN",
      "2": "TRUE/FALSE/NOT GIVEN",
      "7": "one word answer",
      "14": "A/B/C/D/E/F/G",
      "18": ["A", "B"],
      "27": "TRUE/FALSE/NOT GIVEN",
      "34": "one word answer"
    }
    const dataStr = JSON.stringify(template, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = 'ielts_answer_key_template.json'
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const calculateRawScore = () => {
    let correct = 0
    let total = 0
    const results = {}

    // Check each answer
    Object.keys(answerKey).forEach(questionId => {
      const studentAnswer = answers[questionId]
      const correctAnswer = answerKey[questionId]
      total++

      if (Array.isArray(correctAnswer)) {
        // Multiple choice questions (need both answers correct)
        const studentAnswers = studentAnswer || []
        const isCorrect = correctAnswer.length === studentAnswers.length && 
                         correctAnswer.every(ans => studentAnswers.includes(ans))
        if (isCorrect) correct++
        results[questionId] = {
          student: studentAnswers,
          correct: correctAnswer,
          isCorrect
        }
      } else {
        // Single answer questions
        const isCorrect = studentAnswer && studentAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()
        if (isCorrect) correct++
        results[questionId] = {
          student: studentAnswer || '',
          correct: correctAnswer,
          isCorrect
        }
      }
    })

    return { correct, total, results }
  }

  const convertToBandScore = (rawScore, totalQuestions) => {
    const percentage = (rawScore / totalQuestions) * 100
    
    // IELTS Reading Band Score Conversion (Academic)
    if (percentage >= 97) return 9.0
    if (percentage >= 94) return 8.5
    if (percentage >= 89) return 8.0
    if (percentage >= 83) return 7.5
    if (percentage >= 75) return 7.0
    if (percentage >= 67) return 6.5
    if (percentage >= 58) return 6.0
    if (percentage >= 50) return 5.5
    if (percentage >= 42) return 5.0
    if (percentage >= 33) return 4.5
    if (percentage >= 25) return 4.0
    if (percentage >= 17) return 3.5
    if (percentage >= 8) return 3.0
    if (percentage >= 3) return 2.5
    return 2.0
  }

  const gradeTest = () => {
    if (Object.keys(answerKey).length === 0) {
      alert('Please upload an answer key first or load the default answer key.')
      return
    }

    const { correct, total, results } = calculateRawScore()
    const bandScore = convertToBandScore(correct, total)
    const percentage = ((correct / total) * 100).toFixed(1)

    setGradingResults({
      rawScore: correct,
      totalQuestions: total,
      percentage,
      bandScore,
      results,
      timestamp: new Date().toISOString()
    })
    setShowGrading(true)
  }

  const getBandDescription = (bandScore) => {
    if (bandScore >= 8.5) return "Expert User - Very Good User"
    if (bandScore >= 7.5) return "Very Good User - Good User"
    if (bandScore >= 6.5) return "Good User - Competent User"
    if (bandScore >= 5.5) return "Competent User - Modest User"
    if (bandScore >= 4.5) return "Modest User - Limited User"
    if (bandScore >= 3.5) return "Limited User - Extremely Limited User"
    return "Extremely Limited User - Non User"
  }

  // Test Management Functions
  const createNewTest = () => {
    if (!newTestName.trim()) {
      alert('Please enter a test name')
      return
    }

    const testId = `test-${Date.now()}`
    const newTest = {
      id: testId,
      name: newTestName.trim(),
      description: `IELTS Reading test created on ${new Date().toLocaleDateString()}`,
      createdDate: new Date().toISOString(),
      answerKey: {}
    }

    setTests(prev => ({
      ...prev,
      [testId]: newTest
    }))

    setNewTestName('')
    alert(`Test "${newTest.name}" created successfully! You can now add an answer key for this test.`)
  }

  const switchToTest = (testId) => {
    if (tests[testId]) {
      setCurrentTestId(testId)
      setAnswerKey(tests[testId].answerKey || {})
      setAnswers({}) // Clear current answers when switching tests
      setHighlights({}) // Clear highlights
      setNotes({}) // Clear notes
      setGradingResults(null) // Clear grading results
      setShowGrading(false)
    }
  }

  const deleteTest = (testId) => {
    if (testId === 'test-1') {
      alert('Cannot delete the default test')
      return
    }

    if (confirm(`Are you sure you want to delete "${tests[testId]?.name}"?`)) {
      const newTests = { ...tests }
      delete newTests[testId]
      setTests(newTests)

      // Switch to default test if current test was deleted
      if (currentTestId === testId) {
        setCurrentTestId('test-1')
        setAnswerKey(tests['test-1']?.answerKey || {})
        setAnswers({})
        setHighlights({})
        setNotes({})
        setGradingResults(null)
        setShowGrading(false)
      }
    }
  }

  const updateTestAnswerKey = (testId, newAnswerKey) => {
    setTests(prev => ({
      ...prev,
      [testId]: {
        ...prev[testId],
        answerKey: newAnswerKey
      }
    }))

    // Update current answer key if this is the active test
    if (testId === currentTestId) {
      setAnswerKey(newAnswerKey)
    }
  }

  const loadDefaultAnswerKey = () => {
    const currentTest = tests[currentTestId]
    if (currentTest && Object.keys(currentTest.answerKey).length > 0) {
      setAnswerKey(currentTest.answerKey)
    } else {
      // Use the original default answer key for new tests
      const defaultKey = {
        1: "FALSE", 2: "NOT GIVEN", 3: "TRUE", 4: "FALSE", 5: "TRUE", 6: "FALSE",
        7: "thorium", 8: "pitchblende", 9: "radium", 10: "soldiers", 11: "illness", 12: "neutron", 13: "leukaemia",
        14: "B", 15: "F", 16: "A", 17: "G",
        18: ["A", "B"], 19: ["C", "D"], 20: ["A", "C"], 21: ["B", "D"], 22: ["A", "D"], 23: ["B", "C"],
        27: "TRUE", 28: "NOT GIVEN", 29: "FALSE", 30: "NOT GIVEN", 31: "TRUE", 32: "NOT GIVEN", 33: "NOT GIVEN",
        34: "language", 35: "shredding", 36: "disappeared", 37: "Order", 38: "revoked", 39: "organisations", 40: "corporations"
      }
      setAnswerKey(defaultKey)
      updateTestAnswerKey(currentTestId, defaultKey)
    }
  }

  const parseAnswerKeyFromText = (text) => {
    const answerKey = {}
    
    // Common patterns for answer keys
    const patterns = [
      // Pattern 1: "1. TRUE" or "1) FALSE" or "1: NOT GIVEN"
      /(\d+)[\.\)\:]\s*(TRUE|FALSE|NOT GIVEN|[A-G]|[a-z]+)/gi,
      // Pattern 2: "Question 1: TRUE" or "Q1: FALSE"
      /(?:Question\s*|Q)(\d+)[\:\.\s]+(TRUE|FALSE|NOT GIVEN|[A-G]|[a-z]+)/gi,
      // Pattern 3: "1 - TRUE" or "1 = FALSE"
      /(\d+)\s*[\-\=]\s*(TRUE|FALSE|NOT GIVEN|[A-G]|[a-z]+)/gi,
      // Pattern 4: Multiple choice arrays like "18: A, B" or "18: A and B"
      /(\d+)[\.\)\:]\s*([A-G](?:\s*,\s*[A-G]|\s+and\s+[A-G])+)/gi
    ]
    
    patterns.forEach(pattern => {
      let match
      while ((match = pattern.exec(text)) !== null) {
        const questionNum = match[1]
        let answer = match[2].trim()
        
        // Handle multiple choice answers
        if (answer.includes(',') || answer.includes('and')) {
          const choices = answer.split(/[,\s]+and\s+|,\s*/).map(choice => choice.trim().toUpperCase())
          answerKey[questionNum] = choices
        } else {
          answerKey[questionNum] = answer.toUpperCase()
        }
      }
    })
    
    return answerKey
  }

  const handleAnswerKeyUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    
    const fileType = file.type
    const fileName = file.name.toLowerCase()
    
    try {
      let parsedAnswerKey = {}
      
      if (fileType === 'application/json' || fileName.endsWith('.json')) {
        // Handle JSON files
        const text = await file.text()
        parsedAnswerKey = JSON.parse(text)
      } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
        // Handle PDF files
        const arrayBuffer = await file.arrayBuffer()
        const text = await extractTextFromPDF(arrayBuffer)
        parsedAnswerKey = parseAnswerKeyFromText(text)
      } else if (
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        fileType === 'application/msword' ||
        fileName.endsWith('.docx') ||
        fileName.endsWith('.doc')
      ) {
        // Handle DOC/DOCX files
        const arrayBuffer = await file.arrayBuffer()
        const text = await extractTextFromWord(arrayBuffer)
        parsedAnswerKey = parseAnswerKeyFromText(text)
      } else {
        throw new Error('Unsupported file format. Please upload JSON, PDF, DOC, or DOCX files.')
      }
      
      if (Object.keys(parsedAnswerKey).length === 0) {
        throw new Error('No answer key data found in the file. Please check the file format and content.')
      }
      
      setAnswerKey(parsedAnswerKey)
      updateTestAnswerKey(currentTestId, parsedAnswerKey)
      
      // Show success message
      const questionCount = Object.keys(parsedAnswerKey).length
      alert(`Successfully loaded ${questionCount} answers from ${file.name}`)
      
    } catch (error) {
      console.error('Error parsing answer key file:', error)
      alert(`Error parsing file: ${error.message}`)
    }
    
    // Clear the input
    event.target.value = ''
  }

  // Contextual toolbar functions
  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (selection.rangeCount > 0 && selection.toString().trim().length > 0) {
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      const selectedText = selection.toString().trim()
      
      // Check if selection is within the reading passage
      const passageElement = document.querySelector('.reading-passage')
      if (passageElement && passageElement.contains(range.commonAncestorContainer)) {
        setContextualToolbar({
          visible: true,
          x: rect.left + rect.width / 2,
          y: rect.top - 10,
          selectedText,
          range: range.cloneRange()
        })
      }
    } else {
      setContextualToolbar(prev => ({ ...prev, visible: false }))
    }
  }

  const highlightWithColor = (color) => {
    if (!contextualToolbar.range) return
    
    const highlightId = Date.now().toString()
    const span = document.createElement('span')
    span.className = `highlight highlight-${color.name}`
    span.style.backgroundColor = color.color
    span.style.position = 'relative'
    span.style.cursor = 'pointer'
    span.setAttribute('data-highlight-id', highlightId)
    span.setAttribute('data-color', color.name)
    
    try {
      contextualToolbar.range.surroundContents(span)
      
      // Store highlight data
      const currentPartHighlights = highlights[`part${currentPart}`] || []
      setHighlights(prev => ({
        ...prev,
        [`part${currentPart}`]: [...currentPartHighlights, {
          id: highlightId,
          text: contextualToolbar.selectedText,
          color: color.name,
          timestamp: new Date().toISOString()
        }]
      }))
      
      // Add hover delete functionality
      span.addEventListener('mouseenter', () => {
        if (!span.querySelector('.delete-highlight')) {
          const deleteBtn = document.createElement('span')
          deleteBtn.className = 'delete-highlight'
          deleteBtn.innerHTML = '×'
          deleteBtn.style.cssText = `
            position: absolute;
            top: -8px;
            right: -8px;
            background: #f44336;
            color: white;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 1000;
          `
          deleteBtn.onclick = (e) => {
            e.stopPropagation()
            removeHighlight(highlightId, span)
          }
          span.appendChild(deleteBtn)
        }
      })
      
      span.addEventListener('mouseleave', () => {
        const deleteBtn = span.querySelector('.delete-highlight')
        if (deleteBtn) deleteBtn.remove()
      })
      
    } catch (error) {
      console.error('Error highlighting text:', error)
    }
    
    // Hide toolbar
    setContextualToolbar(prev => ({ ...prev, visible: false }))
    window.getSelection().removeAllRanges()
  }

  const removeHighlight = (highlightId, spanElement) => {
    // Remove from state
    setHighlights(prev => ({
      ...prev,
      [`part${currentPart}`]: (prev[`part${currentPart}`] || []).filter(h => h.id !== highlightId)
    }))
    
    // Remove from DOM
    const parent = spanElement.parentNode
    while (spanElement.firstChild) {
      parent.insertBefore(spanElement.firstChild, spanElement)
    }
    parent.removeChild(spanElement)
    parent.normalize()
  }

  const addContextualNote = () => {
    if (!contextualToolbar.selectedText) return
    
    const noteId = Date.now().toString()
    const noteText = prompt('Add a note for the selected text:', '')
    
    if (noteText && noteText.trim()) {
      const currentPartNotes = notes[`part${currentPart}`] || []
      const newNoteObj = {
        id: noteId,
        title: contextualToolbar.selectedText.substring(0, 50) + (contextualToolbar.selectedText.length > 50 ? '...' : ''),
        content: noteText.trim(),
        selectedText: contextualToolbar.selectedText,
        timestamp: new Date().toISOString(),
        part: currentPart
      }
      
      setNotes(prev => ({
        ...prev,
        [`part${currentPart}`]: [...currentPartNotes, newNoteObj]
      }))
      
      // Highlight the text with a note indicator
      highlightWithColor({ name: 'note', color: '#fff3cd', label: 'Note' })
    }
    
    setContextualToolbar(prev => ({ ...prev, visible: false }))
    window.getSelection().removeAllRanges()
  }

  // Add event listeners for text selection
  useEffect(() => {
    document.addEventListener('mouseup', handleTextSelection)
    document.addEventListener('keyup', handleTextSelection)
    
    return () => {
      document.removeEventListener('mouseup', handleTextSelection)
      document.removeEventListener('keyup', handleTextSelection)
    }
  }, [currentPart])

  const extractTextFromPDF = async (arrayBuffer) => {
    try {
      // Use PDF.js library for PDF parsing
      const pdfjsLib = window.pdfjsLib
      if (!pdfjsLib) {
        throw new Error('PDF.js library not loaded')
      }
      
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      let fullText = ''
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map(item => item.str).join(' ')
        fullText += pageText + '\n'
      }
      
      return fullText
    } catch (error) {
      throw new Error('Failed to extract text from PDF. Please ensure the PDF contains readable text.')
    }
  }

  const extractTextFromWord = async (arrayBuffer) => {
    try {
      // Use mammoth.js library for Word document parsing
      const mammoth = window.mammoth
      if (!mammoth) {
        throw new Error('Mammoth.js library not loaded')
      }
      
      const result = await mammoth.extractRawText({ arrayBuffer })
      return result.value
    } catch (error) {
      throw new Error('Failed to extract text from Word document. Please ensure the document is not corrupted.')
    }
  }

  const exportTestData = (testId) => {
    const test = tests[testId]
    if (!test) return

    const exportData = {
      testInfo: {
        name: test.name,
        description: test.description,
        createdDate: test.createdDate
      },
      answerKey: test.answerKey
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `${test.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_data.json`
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const parts = [
    {
      id: 1,
      title: "Part 1",
      description: "Read the text and answer questions 1–13.",
      questions: 13,
      passage: {
        title: "The life and work of Marie Curie",
        content: `Marie Curie is probably the most famous woman scientist who has ever lived. Born Maria Sklodowska in Poland in 1867, she is famous for her work on radioactivity, and was twice a winner of the Nobel Prize. With her husband, Pierre Curie, and Henri Becquerel, she was awarded the 1903 Nobel Prize for Physics, and was then sole winner of the 1911 Nobel Prize for Chemistry. She was the first woman to win a Nobel Prize.

From childhood, Marie was remarkable for her prodigious memory, and at the age of 16 won a gold medal on completion of her secondary education. Because her father lost his savings through bad investment, she then had to take work as a teacher. From her earnings she was able to finance her sister Bronia's medical studies in Paris, on the understanding that Bronia would, in turn, later help her to get an education.

In 1891 this promise was fulfilled and Marie went to Paris and began to study at the Sorbonne (the University of Paris). She often worked far into the night and lived on little more than bread and butter and tea. She came first in the examination in the physical sciences in 1893, and in 1894 was placed second in the examination in mathematical sciences. It was not until the spring of that year that she was introduced to Pierre Curie.

Their marriage in 1895 marked the start of a partnership that was soon to achieve results of world significance. Following Henri Becquerel's discovery in 1896 of a new phenomenon, which Marie later called 'radioactivity', Marie Curie decided to find out if the radioactivity discovered in uranium was to be found in other elements. She discovered that this was true for thorium.

Turning her attention to minerals, she found her interest drawn to pitchblende, a mineral whose radioactivity, superior to that of pure uranium, could be explained only by the presence in the ore of small quantities of an unknown substance of very high activity. Pierre Curie joined her in the work that she had undertaken to resolve this problem, and that led to the discovery of the new elements, polonium and radium. While Pierre Curie devoted himself chiefly to the physical study of the new radiations, Marie Curie struggled to obtain pure radium in the metallic state. This was achieved with the help of the chemist André-Louis Debierne, one of Pierre Curie's pupils. Based on the results of this research, Marie Curie received her Doctorate of Science, and in 1903 Marie and Pierre shared with Becquerel the Nobel Prize for Physics for the discovery of radioactivity.

The births of Marie's two daughters, Irène and Eve, in 1897 and 1904 failed to interrupt her scientific work. She was appointed lecturer in physics at the École Normale Supérieure for girls in Sèvres, France (1900), and introduced a method of teaching based on experimental demonstrations. In December 1904 she was appointed chief assistant in the laboratory directed by Pierre Curie.

The sudden death of her husband in 1906 was a bitter blow to Marie Curie, but was also a turning point in her career: henceforth she was to devote all her energy to completing alone the scientific work that they had undertaken. On May 13, 1906, she was appointed to the professorship that had been left vacant on her husband's death, becoming the first woman to teach at the Sorbonne. In 1911 she was awarded the Nobel Prize for Chemistry for the isolation of a pure form of radium.

During World War I, Marie Curie, with the help of her daughter Irène, devoted herself to the development of the use of X-radiography, including the mobile units which came to be known as 'Little Curies', used for the treatment of wounded soldiers. In 1918 the Radium Institute, whose staff Irène had joined, began to operate in earnest, and became a centre for nuclear physics and chemistry. Marie Curie, now at the highest point of her fame and, from 1922, a member of the Academy of Medicine, researched the chemistry of radioactive substances and their medical applications.

In 1921, accompanied by her two daughters, Marie Curie made a triumphant journey to the United States to raise funds for research on radium. Women there presented her with a gram of radium for her campaign. Marie also gave lectures in Belgium, Brazil, Spain and Czechoslovakia and, in addition, had the satisfaction of seeing the development of the Curie Foundation in Paris, and the inauguration in 1932 in Warsaw of the Radium Institute, where her sister Bronia became director.

One of Marie Curie's outstanding achievements was to have understood the need to accumulate intense radioactive sources, not only to treat illness but also to maintain an abundant supply for research. The existence in Paris at the Radium Institute of a stock of 1.5 grams of radium made a decisive contribution to the success of the experiments undertaken in the years around 1930. This work prepared the way for the discovery of the neutron by Sir James Chadwick and, above all, for the discovery in 1934 by Irène and Frédéric Joliot-Curie of artificial radioactivity. A few months after this discovery, Marie Curie died as a result of leukaemia caused by exposure to radiation. She had often carried test tubes containing radioactive isotopes in her pocket, remarking on the pretty blue-green light they gave off.

Her contribution to physics had been immense, not only in her own work, the importance of which had been demonstrated by her two Nobel Prizes, but because of her influence on subsequent generations of nuclear physicists and chemists.`
      }
    },
    {
      id: 2,
      title: "Part 2",
      description: "Read the text and answer questions 14–26.",
      questions: 13,
      passage: {
        title: "The Physics of Traffic Behavior",
        content: `Some years ago, when several theoretical physicists, principally Dirk Helbing and Boris Kerner of Stuttgart, Germany, began publishing papers on traffic flow in publications formally read by traffic engineers, they were clearly working outside their sphere of investigation. They had noticed that if they simulated the movement of vehicles on a highway, using the equations that describe how the molecules of a gas move, some very strange results emerged. Of course, vehicles do not behave exactly like gas molecules: for example, drivers try to avoid collisions by slowing down when they get too near another vehicle, whereas gas molecules have no such concern. However, the physicists modified the equations to take the differences into account and the overall description of traffic as a flowing gas has proved to be a very good one; the moving-gas model of traffic reproduces many phenomena seen in real-world traffic.

The strangest thing that came out of these equations, however, was the implication that congestion can arise completely spontaneously; no external cause is necessary. Vehicles can be flowing freely along, and then suddenly get into a slow-moving ooze. Under the right conditions a brief and local fluctuation in the speed or the distance between vehicles is all that is needed to trigger a system-wide breakdown that persists for hours. In fact, the physicists' analysis suggested such spontaneous breakdowns in traffic flow probably occur quite frequently on highways.

The movements took shape only in the 1970s, so it is too soon to ascertain their long-term influence on the characteristics of language varieties. But they have certainly played a major part in promoting public awareness of the existence of communication problems, and have influenced many organisations to do something about it. In Britain, the campaign was launched in 1979, by a ritual shredding of government forms in Parliament Square, London. By 1982, the government had published a report telling departments to improve the design of forms, and to abolish those that were no longer needed. By 1985, around 15,700 forms had disappeared and 21,300 had been revised. In the USA, President Carter's Executive Order of March 1978 required regulations to be written in plain English, and although this was revoked by President Reagan in 1981, it promoted a great deal of legislation throughout the country, and an increase in plain English usage amongst corporations and consumers.`
      }
    },
    {
      id: 3,
      title: "Part 3",
      description: "Read the text and answer questions 27–40.",
      questions: 14,
      passage: {
        title: "Plain English",
        content: `There is no theoretical limit to the number of special purposes to which language can be put. As society develops new fields, language is devised to express them. However, the result is often that language becomes very specialised and complex, and complications arise as ordinary people struggle to make sense of it.

Popular anxiety over special uses of language is most markedly seen in the campaigns to promote 'plain' speaking and writing – notably, the Plain English movements of Britain and the USA. The main aim of these campaigns is to attack the use of unnecessarily complicated language ('gobbledegook') by governments, businesses and other authorities whose role puts them in linguistic contact with the general public. The campaigners argue that such language, whether spoken or written, should be replaced by clearer forms of expression.

The movements took shape only in the 1970s, so it is too soon to ascertain their long-term influence on the characteristics of language varieties. But they have certainly played a major part in promoting public awareness of the existence of communication problems, and have influenced many organisations to do something about it. In Britain, the campaign was launched in 1979, by a ritual shredding of government forms in Parliament Square, London. By 1982, the government had published a report telling departments to improve the design of forms, and to abolish those that were no longer needed. By 1985, around 15,700 forms had disappeared and 21,300 had been revised. In the USA, President Carter's Executive Order of March 1978 required regulations to be written in plain English, and although this was revoked by President Reagan in 1981, it promoted a great deal of legislation throughout the country, and an increase in plain English usage amongst corporations and consumers.`
      }
    }
  ]

  const headingOptions = [
    "How a maths experiment actually reduced traffic congestion",
    "How a concept from one field of study was applied in another",
    "A lack of investment in driver training",
    "Areas of doubt and disagreement between experts",
    "How different countries have dealt with traffic congestion",
    "The impact of driver behavior on traffic speed",
    "A proposal to take control away from the driver"
  ]

  const renderQuestions = () => {
    if (currentPart === 1) {
      if (currentQuestion <= 6) {
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Questions 1–6</h3>
              <p className="text-sm text-gray-600 mb-6">
                Choose <strong>TRUE</strong> if the statement agrees with the information given in the text, 
                choose <strong>FALSE</strong> if the statement contradicts the information, or choose <strong>NOT GIVEN</strong> if there is no information on this.
              </p>
            </div>
            
            {[1, 2, 3, 4, 5, 6].map(q => (
              <div key={q} className="border-b pb-4">
                <div className="flex items-start gap-3 mb-3">
                  <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-medium">{q}</span>
                  <p className="text-sm">
                    {q === 1 && "Marie Curie's husband was a joint winner of both Marie's Nobel Prizes."}
                    {q === 2 && "Marie became interested in science when she was a child."}
                    {q === 3 && "Marie was able to attend the Sorbonne because of her sister's financial contribution."}
                    {q === 4 && "Marie stopped doing research for several years when her children were born."}
                    {q === 5 && "Marie took over the teaching position her husband had held."}
                    {q === 6 && "Marie's sister Bronia studied the medical uses of radioactivity."}
                  </p>
                </div>
                <RadioGroup 
                  value={answers[q] || ""} 
                  onValueChange={(value) => handleAnswerChange(q, value)}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="TRUE" id={`q${q}-true`} />
                    <Label htmlFor={`q${q}-true`}>TRUE</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="FALSE" id={`q${q}-false`} />
                    <Label htmlFor={`q${q}-false`}>FALSE</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="NOT GIVEN" id={`q${q}-notgiven`} />
                    <Label htmlFor={`q${q}-notgiven`}>NOT GIVEN</Label>
                  </div>
                </RadioGroup>
              </div>
            ))}
          </div>
        )
      } else {
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Questions 7–13</h3>
              <p className="text-sm text-gray-600 mb-6">
                Complete the notes. Write <strong>ONE WORD ONLY</strong> from the text for each answer.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Marie Curie's research on radioactivity</h4>
              
              {[7, 8, 9, 10, 11, 12, 13].map(q => (
                <div key={q} className="flex items-center gap-3">
                  <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-medium">{q}</span>
                  <div className="flex-1">
                    {q === 7 && (
                      <p className="text-sm">
                        When uranium was discovered to be radioactive, Marie Curie found that the element called{' '}
                        <Input 
                          className="inline-block w-32 mx-1" 
                          value={answers[q] || ""} 
                          onChange={(e) => handleAnswerChange(q, e.target.value)}
                        />
                        {' '}had the same property.
                      </p>
                    )}
                    {q === 8 && (
                      <p className="text-sm">
                        Marie and Pierre Curie's research into the radioactivity of the mineral known as{' '}
                        <Input 
                          className="inline-block w-32 mx-1" 
                          value={answers[q] || ""} 
                          onChange={(e) => handleAnswerChange(q, e.target.value)}
                        />
                        {' '}led to the discovery of two new elements.
                      </p>
                    )}
                    {q === 9 && (
                      <p className="text-sm">
                        In 1911, Marie Curie received recognition for her work on the element{' '}
                        <Input 
                          className="inline-block w-32 mx-1" 
                          value={answers[q] || ""} 
                          onChange={(e) => handleAnswerChange(q, e.target.value)}
                        />
                        .
                      </p>
                    )}
                    {q === 10 && (
                      <p className="text-sm">
                        Marie and Irène Curie developed X-radiography which was used as a medical technique for{' '}
                        <Input 
                          className="inline-block w-32 mx-1" 
                          value={answers[q] || ""} 
                          onChange={(e) => handleAnswerChange(q, e.target.value)}
                        />
                        .
                      </p>
                    )}
                    {q === 11 && (
                      <p className="text-sm">
                        Marie Curie saw the importance of collecting radioactive material both for research and for cases of{' '}
                        <Input 
                          className="inline-block w-32 mx-1" 
                          value={answers[q] || ""} 
                          onChange={(e) => handleAnswerChange(q, e.target.value)}
                        />
                        .
                      </p>
                    )}
                    {q === 12 && (
                      <p className="text-sm">
                        The radioactive material stocked in Paris contributed to the discoveries in the 1930s of the{' '}
                        <Input 
                          className="inline-block w-32 mx-1" 
                          value={answers[q] || ""} 
                          onChange={(e) => handleAnswerChange(q, e.target.value)}
                        />
                        {' '}and of what was known as artificial radioactivity.
                      </p>
                    )}
                    {q === 13 && (
                      <p className="text-sm">
                        During her research, Marie Curie was exposed to radiation and as a result she suffered from{' '}
                        <Input 
                          className="inline-block w-32 mx-1" 
                          value={answers[q] || ""} 
                          onChange={(e) => handleAnswerChange(q, e.target.value)}
                        />
                        .
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      }
    }
    
    if (currentPart === 2) {
      if (currentQuestion >= 14 && currentQuestion <= 17) {
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Questions 14–17</h3>
              <p className="text-sm text-gray-600 mb-6">
                The text has four sections. Choose the correct heading for each section and move it into the gap.
              </p>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold mb-3">List of Headings</h4>
              <div className="grid grid-cols-1 gap-2">
                {headingOptions.map((heading, index) => (
                  <div key={index} className="p-3 border rounded bg-blue-50 text-sm">
                    {String.fromCharCode(65 + index)}. {heading}
                  </div>
                ))}
              </div>
            </div>

            {[14, 15, 16, 17].map(q => (
              <div key={q} className="border-b pb-4">
                <div className="flex items-start gap-3 mb-3">
                  <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-medium">{q}</span>
                  <p className="text-sm">Section {q - 13}</p>
                </div>
                <RadioGroup 
                  value={answers[q] || ""} 
                  onValueChange={(value) => handleAnswerChange(q, value)}
                  className="space-y-2"
                >
                  {headingOptions.map((heading, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={String.fromCharCode(65 + index)} id={`q${q}-${index}`} />
                      <Label htmlFor={`q${q}-${index}`} className="text-sm">
                        {String.fromCharCode(65 + index)}. {heading}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>
        )
      } else {
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Questions 18–23</h3>
              <p className="text-sm text-gray-600 mb-6">
                Choose <strong>TWO</strong> correct answers.
              </p>
            </div>
            
            {[18, 19, 20, 21, 22, 23].map(q => (
              <div key={q} className="border-b pb-4">
                <div className="flex items-start gap-3 mb-3">
                  <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-medium">{q}</span>
                  <p className="text-sm">
                    {q === 18 && "Which TWO options describe what the writer is doing in section two?"}
                    {q === 19 && "Which TWO factors are mentioned as affecting traffic flow?"}
                    {q === 20 && "Which TWO conclusions did the physicists reach?"}
                    {q === 21 && "Which TWO applications are mentioned for the research?"}
                    {q === 22 && "Which TWO problems are identified with current systems?"}
                    {q === 23 && "Which TWO solutions are proposed in the text?"}
                  </p>
                </div>
                <div className="space-y-2">
                  {[
                    "explaining Helbing and Kerner's attitude to chaos theory",
                    "clarifying Helbing and Kerner's conclusions about traffic behaviour",
                    "showing how weather and temperature can change traffic flow",
                    "drawing parallels between the behaviour of clouds and traffic"
                  ].map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`q${q}-${index}`}
                        checked={(answers[q] || []).includes(String.fromCharCode(65 + index))}
                        onCheckedChange={(checked) => handleMultipleAnswerChange(q, String.fromCharCode(65 + index), checked)}
                      />
                      <Label htmlFor={`q${q}-${index}`} className="text-sm">
                        {String.fromCharCode(65 + index)}. {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      }
    }

    if (currentPart === 3) {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Questions 27–33</h3>
            <p className="text-sm text-gray-600 mb-6">
              Choose <strong>TRUE</strong> if the statement agrees with the information given in the text, 
              choose <strong>FALSE</strong> if the statement contradicts the information, or choose <strong>NOT GIVEN</strong> if there is no information on this.
            </p>
          </div>
          
          {[27, 28, 29, 30, 31, 32, 33].map(q => (
            <div key={q} className="border-b pb-4">
              <div className="flex items-start gap-3 mb-3">
                <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-medium">{q}</span>
                <p className="text-sm">
                  {q === 27 && "The Plain English campaigns are concerned with the language officials use when communicating with ordinary people."}
                  {q === 28 && "Campaigners found it difficult to talk to government officials."}
                  {q === 29 && "A change of president in the US meant that the effects of the campaign there were negligible."}
                  {q === 30 && "The campaigns have been more successful in Britain than in the USA."}
                  {q === 31 && "The number of government forms has been reduced in both countries."}
                  {q === 32 && "Language specialists were consulted during the campaigns."}
                  {q === 33 && "The campaigns have had a lasting impact on government communication."}
                </p>
              </div>
              <RadioGroup 
                value={answers[q] || ""} 
                onValueChange={(value) => handleAnswerChange(q, value)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="TRUE" id={`q${q}-true`} />
                  <Label htmlFor={`q${q}-true`}>TRUE</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="FALSE" id={`q${q}-false`} />
                  <Label htmlFor={`q${q}-false`}>FALSE</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="NOT GIVEN" id={`q${q}-notgiven`} />
                  <Label htmlFor={`q${q}-notgiven`}>NOT GIVEN</Label>
                </div>
              </RadioGroup>
            </div>
          ))}

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Questions 34–40</h3>
            <p className="text-sm text-gray-600 mb-6">
              Complete the summary. Write <strong>ONE WORD ONLY</strong> from the text for each answer.
            </p>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Summary: The Plain English Movement</h4>
              
              {[34, 35, 36, 37, 38, 39, 40].map(q => (
                <div key={q} className="flex items-center gap-3">
                  <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-medium">{q}</span>
                  <div className="flex-1">
                    {q === 34 && (
                      <p className="text-sm">
                        The Plain English movement aims to replace unnecessarily complicated{' '}
                        <Input 
                          className="inline-block w-32 mx-1" 
                          value={answers[q] || ""} 
                          onChange={(e) => handleAnswerChange(q, e.target.value)}
                        />
                        {' '}with clearer forms of expression.
                      </p>
                    )}
                    {q === 35 && (
                      <p className="text-sm">
                        The campaign in Britain began with a symbolic{' '}
                        <Input 
                          className="inline-block w-32 mx-1" 
                          value={answers[q] || ""} 
                          onChange={(e) => handleAnswerChange(q, e.target.value)}
                        />
                        {' '}of government forms.
                      </p>
                    )}
                    {q === 36 && (
                      <p className="text-sm">
                        By 1985, thousands of forms had been{' '}
                        <Input 
                          className="inline-block w-32 mx-1" 
                          value={answers[q] || ""} 
                          onChange={(e) => handleAnswerChange(q, e.target.value)}
                        />
                        {' '}or revised.
                      </p>
                    )}
                    {q === 37 && (
                      <p className="text-sm">
                        President Carter's{' '}
                        <Input 
                          className="inline-block w-32 mx-1" 
                          value={answers[q] || ""} 
                          onChange={(e) => handleAnswerChange(q, e.target.value)}
                        />
                        {' '}required regulations to be written in plain English.
                      </p>
                    )}
                    {q === 38 && (
                      <p className="text-sm">
                        Although this was later{' '}
                        <Input 
                          className="inline-block w-32 mx-1" 
                          value={answers[q] || ""} 
                          onChange={(e) => handleAnswerChange(q, e.target.value)}
                        />
                        , it had a lasting impact.
                      </p>
                    )}
                    {q === 39 && (
                      <p className="text-sm">
                        The movement influenced many{' '}
                        <Input 
                          className="inline-block w-32 mx-1" 
                          value={answers[q] || ""} 
                          onChange={(e) => handleAnswerChange(q, e.target.value)}
                        />
                        {' '}to improve their communication.
                      </p>
                    )}
                    {q === 40 && (
                      <p className="text-sm">
                        There was an increase in plain English usage among{' '}
                        <Input 
                          className="inline-block w-32 mx-1" 
                          value={answers[q] || ""} 
                          onChange={(e) => handleAnswerChange(q, e.target.value)}
                        />
                        {' '}and consumers.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }
    
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Questions for Part {currentPart} will be displayed here.</p>
        <p className="text-sm text-gray-500 mt-2">This is a demonstration of the IELTS Reading test interface.</p>
      </div>
    )
  }

  const currentPartData = parts.find(p => p.id === currentPart)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contextual Toolbar */}
      {contextualToolbar.visible && (
        <div 
          className="contextual-toolbar"
          style={{
            position: 'fixed',
            left: `${contextualToolbar.x}px`,
            top: `${contextualToolbar.y}px`,
            transform: 'translateX(-50%)',
            zIndex: 1000,
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            gap: '4px',
            alignItems: 'center'
          }}
        >
          {/* Highlight Color Options */}
          {highlightColors.map(color => (
            <button
              key={color.name}
              onClick={() => highlightWithColor(color)}
              style={{
                width: '24px',
                height: '24px',
                backgroundColor: color.color,
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
                margin: '0 2px'
              }}
              title={`Highlight with ${color.label}`}
            />
          ))}
          
          {/* Note-taking Button */}
          <button
            onClick={addContextualNote}
            style={{
              padding: '4px 8px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="Add Note"
          >
            📝 Note
          </button>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={ieltsLogo} alt="IELTS" className="h-8 w-auto" />
            <span className="text-sm text-gray-600">Test taker ID</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span className="font-mono">{formatTime(timeRemaining)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4" />
              <span className="font-medium">{tests[currentTestId]?.name || 'Loading...'}</span>
            </div>
          </div>
          <div className="header-buttons">
          <Button variant="outline" size="sm" className="header-btn">
            <MessageSquare className="w-4 h-4 mr-1" />
            Messages
          </Button>
          <Button variant="outline" size="sm" className="header-btn">
            <Settings className="w-4 h-4 mr-1" />
            Options
          </Button>
          <Button variant="outline" size="sm" className="header-btn">
            <HelpCircle className="w-4 h-4 mr-1" />
            Help
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className={`header-btn ${showTestManager ? 'active' : ''}`}
            onClick={() => setShowTestManager(!showTestManager)}
          >
            <Library className="w-4 h-4 mr-1" />
            Test Manager
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className={`header-btn ${showAnswerKey ? 'active' : ''}`}
            onClick={() => setShowAnswerKey(!showAnswerKey)}
          >
            <FileText className="w-4 h-4 mr-1" />
            Answer Key
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="header-btn grade-btn"
            onClick={gradeTest}
          >
            <Award className="w-4 h-4 mr-1" />
            Grade Test
          </Button>
        </div>        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Panel - Reading Passage */}
        <div className="w-1/2 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            <div className="bg-gray-100 p-3 rounded mb-6">
              <h2 className="font-semibold">{currentPartData.title}</h2>
              <p className="text-sm text-gray-600">{currentPartData.description}</p>
            </div>

            {/* Enhanced Highlighting Controls */}
            <div className="mb-4 flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <Button
                variant={highlightMode ? "default" : "outline"}
                size="sm"
                onClick={() => setHighlightMode(!highlightMode)}
                className={highlightMode ? "bg-yellow-500 hover:bg-yellow-600" : ""}
              >
                <Highlighter className="h-4 w-4 mr-1" />
                {highlightMode ? "Highlighting ON" : "Enable Highlighting"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllHighlights}
                disabled={Object.keys(highlights).length === 0}
              >
                <Eraser className="h-4 w-4 mr-1" />
                Clear All
              </Button>
              <span className="text-xs text-gray-600">
                {highlightMode ? "Select text to highlight • Hover over highlights to delete individually" : "Click to enable highlighting"}
              </span>
            </div>

            {/* Notes Controls */}
            <div className="mb-4 flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded">
              <Button
                variant={showNotes ? "default" : "outline"}
                size="sm"
                onClick={() => setShowNotes(!showNotes)}
                className={showNotes ? "bg-blue-500 hover:bg-blue-600" : ""}
              >
                <NotebookPen className="h-4 w-4 mr-1" />
                {showNotes ? "Hide Notes" : "Show Notes"}
              </Button>
              <span className="text-xs text-gray-600">
                {Object.keys(notes).length} notes saved
              </span>
            </div>
            
            <div 
              className="reading-passage prose prose-sm max-w-none select-text bg-white p-6 rounded-lg shadow-sm"
              style={{ userSelect: 'text', WebkitUserSelect: 'text' }}
            >
              <h2 className="text-xl font-bold mb-4">{currentPartData.passage.title}</h2>
              <div className="whitespace-pre-line text-sm leading-relaxed">
                {currentPartData.passage.content}
              </div>
            </div>

            {/* Enhanced Highlight Summary */}
            {Object.keys(highlights).length > 0 && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Highlighter className="h-4 w-4" />
                  Your Highlights ({Object.keys(highlights).length})
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto highlight-summary">
                  {Object.entries(highlights).map(([id, highlight]) => (
                    <div key={id} className="flex items-center justify-between text-xs p-2 bg-white rounded border">
                      <span className="font-medium flex-1">"{highlight.text.substring(0, 50)}..."</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteHighlight(id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700 ml-2"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 Tip: Hover over highlighted text in the passage to delete individual highlights
                </p>
              </div>
            )}

            {/* Notes Panel */}
            {showNotes && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
                  <NotebookPen className="h-4 w-4" />
                  My Notes
                </h4>
                
                {/* Add New Note */}
                <div className="mb-4 p-3 bg-white rounded border add-note-form">
                  <h5 className="text-xs font-medium mb-2">Add New Note</h5>
                  <Input
                    placeholder="Note title..."
                    value={newNote.title}
                    onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                    className="mb-2 text-xs"
                  />
                  <Textarea
                    placeholder="Write your note here..."
                    value={newNote.content}
                    onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                    className="mb-2 text-xs min-h-[60px]"
                  />
                  <Button
                    size="sm"
                    onClick={addNote}
                    disabled={!newNote.title.trim() || !newNote.content.trim()}
                    className="text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Note
                  </Button>
                </div>

                {/* Enhanced Notes List with Hover-to-Delete */}
                <div className="space-y-2 max-h-64 overflow-y-auto notes-scrollbar">
                  {getAllNotes().length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-4">No notes yet. Add your first note above!</p>
                  ) : (
                    getAllNotes().map(note => (
                      <div key={note.id} className="note-item-enhanced">
                        {editingNote === note.id ? (
                          <div className="space-y-2 note-edit-mode p-3 bg-white rounded border">
                            <Input
                              value={note.title}
                              onChange={(e) => setNotes(prev => ({
                                ...prev,
                                [note.id]: { ...prev[note.id], title: e.target.value }
                              }))}
                              className="text-xs font-medium"
                            />
                            <Textarea
                              value={note.content}
                              onChange={(e) => setNotes(prev => ({
                                ...prev,
                                [note.id]: { ...prev[note.id], content: e.target.value }
                              }))}
                              className="text-xs min-h-[60px]"
                            />
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                onClick={() => updateNote(note.id, note)}
                                className="text-xs"
                              >
                                <Save className="h-3 w-3 mr-1" />
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingNote(null)}
                                className="text-xs"
                              >
                                <X className="h-3 w-3 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="note-content-wrapper">
                            {/* Hover Delete Button */}
                            <button
                              className="note-hover-delete"
                              onClick={() => deleteNote(note.id)}
                              title="Delete this note"
                            >
                              ×
                            </button>
                            
                            <div className="p-3 bg-white rounded border note-content">
                              <div className="flex items-start justify-between mb-1">
                                <h6 className="text-xs font-medium pr-2">{note.title}</h6>
                                <div className="flex gap-1 note-controls-traditional">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingNote(note.id)}
                                    className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                                  >
                                    <Edit3 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 mb-1 pr-2">{note.content}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span className="part-indicator">Part {note.part}</span>
                                <span>•</span>
                                <span>{new Date(note.lastModified).toLocaleTimeString()}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
                
                {/* Enhanced Notes Instructions */}
                {getAllNotes().length > 0 && (
                  <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-700">
                    💡 <strong>Tip:</strong> Hover over any note to see the delete button (×) in the top-right corner
                  </div>
                )}
              </div>
            )}

            {/* Test Manager Panel */}
          {showTestManager && (
            <Card className="mb-4 test-manager-panel">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Library className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-600">Test Manager</h3>
                </div>

                {/* Create New Test */}
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <FolderPlus className="h-4 w-4" />
                    Create New Test
                  </h4>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter test name..."
                      value={newTestName}
                      onChange={(e) => setNewTestName(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={createNewTest} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Test List */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-600 mb-2">Available Tests ({Object.keys(tests).length})</h4>
                  {Object.values(tests).map((test) => (
                    <div 
                      key={test.id} 
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        currentTestId === test.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => switchToTest(test.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{test.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{test.description}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            Created: {new Date(test.createdDate).toLocaleDateString()}
                          </div>
                          <div className="text-xs mt-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                              Object.keys(test.answerKey || {}).length > 0 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              <CheckCircle className="h-3 w-3" />
                              {Object.keys(test.answerKey || {}).length > 0 
                                ? `${Object.keys(test.answerKey).length} answers` 
                                : 'No answer key'
                              }
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 ml-2">
                          {currentTestId === test.id && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              Active
                            </span>
                          )}
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                exportTestData(test.id)
                              }}
                              className="h-6 w-6 p-0"
                            >
                              <Upload className="h-3 w-3" />
                            </Button>
                            {test.id !== 'test-1' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteTest(test.id)
                                }}
                                className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                  <strong>Instructions:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• Click on a test to switch to it</li>
                    <li>• Create new tests with custom names</li>
                    <li>• Each test has its own answer key</li>
                    <li>• Export test data for backup</li>
                    <li>• Default test cannot be deleted</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Answer Key Management Panel */}
            {showAnswerKey && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
                <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Answer Key Management
                </h4>
                
                <div className="mb-3 p-2 bg-white rounded border">
                  <div className="text-xs text-gray-600 mb-1">Current Test:</div>
                  <div className="font-medium text-sm">{tests[currentTestId]?.name}</div>
                  <div className="text-xs text-gray-500">{tests[currentTestId]?.description}</div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={loadDefaultAnswerKey}
                      className="text-xs bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Load Default Key
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={downloadAnswerKeyTemplate}
                      className="text-xs"
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Download Template
                    </Button>
                  </div>
                  
                  <div>
                    <Label htmlFor="answer-key-upload" className="text-xs font-medium">
                      Upload Answer Key (JSON, PDF, DOC, DOCX)
                    </Label>
                    <Input
                      id="answer-key-upload"
                      type="file"
                      accept=".json,.pdf,.doc,.docx,application/json,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleAnswerKeyUpload}
                      className="text-xs mt-1"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Supports: JSON (structured), PDF (text), Word documents
                    </div>
                  </div>
                  
                  {Object.keys(answerKey).length > 0 && (
                    <div className="p-2 bg-white rounded border">
                      <p className="text-xs font-medium mb-1">
                        Answer Key Status: ✅ Loaded ({Object.keys(answerKey).length} questions)
                      </p>
                      <p className="text-xs text-gray-600">
                        Ready to grade student responses
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Grading Results Panel */}
            {showGrading && gradingResults && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Test Results
                  </h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowGrading(false)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {/* Overall Score */}
                  <div className="p-3 bg-white rounded border">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        Band {gradingResults.bandScore}
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        {getBandDescription(gradingResults.bandScore)}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{gradingResults.rawScore}</span>
                        <span className="text-gray-500">/{gradingResults.totalQuestions}</span>
                        <span className="ml-2 text-gray-500">({gradingResults.percentage}%)</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Detailed Results */}
                  <div className="max-h-48 overflow-y-auto">
                    <h5 className="text-xs font-medium mb-2">Question-by-Question Results:</h5>
                    <div className="space-y-1">
                      {Object.entries(gradingResults.results).map(([questionId, result]) => (
                        <div key={questionId} className={`p-2 rounded text-xs ${
                          result.isCorrect ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200'
                        } border`}>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Q{questionId}</span>
                            <span className={result.isCorrect ? 'text-green-600' : 'text-red-600'}>
                              {result.isCorrect ? '✓' : '✗'}
                            </span>
                          </div>
                          <div className="mt-1">
                            <div>Your answer: {Array.isArray(result.student) ? result.student.join(', ') : result.student || 'No answer'}</div>
                            <div>Correct answer: {Array.isArray(result.correct) ? result.correct.join(', ') : result.correct}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 text-center">
                    Graded on {new Date(gradingResults.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Questions */}
        <div className="w-1/2 bg-white overflow-y-auto">
          <div className="p-6">
            {renderQuestions()}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <footer className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {parts.map(part => (
              <Button
                key={part.id}
                variant={currentPart === part.id ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPart(part.id)}
                className={currentPart === part.id ? "bg-red-600 hover:bg-red-700" : ""}
              >
                {part.title}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            {Array.from({ length: currentPartData.questions }, (_, i) => {
              const questionNum = currentPart === 1 ? i + 1 : 
                                currentPart === 2 ? i + 14 : i + 27
              const status = getQuestionStatus(questionNum)
              return (
                <Button
                  key={questionNum}
                  variant="outline"
                  size="sm"
                  className={`w-8 h-8 p-0 text-xs ${
                    status === 'attempted' ? 'bg-green-100 border-green-300' : 
                    currentQuestion === questionNum ? 'bg-blue-100 border-blue-300' : ''
                  }`}
                  onClick={() => setCurrentQuestion(questionNum)}
                >
                  {questionNum}
                </Button>
              )
            })}
            
            <Button variant="outline" size="sm" className="ml-4">
              Review your answers
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

