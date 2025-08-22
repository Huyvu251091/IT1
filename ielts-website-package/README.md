# IELTS Reading Mock Test Website

A comprehensive IELTS Reading practice platform with advanced features for students and educators.

## 🌟 Features

### For Students
- **Authentic IELTS Interface**: Professional design matching real IELTS test conditions
- **Multiple Question Types**: True/False/Not Given, Fill-in-the-blank, Multiple choice, Matching headings
- **Advanced Highlighting**: 6-color contextual highlighting system with individual deletion
- **Smart Note-Taking**: Contextual notes with hover-to-delete functionality
- **Timer & Navigation**: 60-minute countdown with part-by-part navigation
- **Progress Tracking**: Visual indicators for attempted/not attempted questions

### For Educators
- **Multiple Test Management**: Create unlimited named tests
- **Automatic Grading**: Raw scores to IELTS Band conversion (1.0-9.0)
- **Multi-Format Upload**: JSON, PDF, DOC/DOCX answer key support
- **Detailed Analytics**: Question-by-question performance analysis
- **Export/Import**: Backup and restore test configurations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm package manager

### Installation

1. **Extract the package** to your desired directory
2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser** to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

The built files will be in the `dist/` directory, ready for deployment.

## 📁 Project Structure

```
ielts-reading-test/
├── src/
│   ├── components/ui/          # Reusable UI components
│   ├── assets/                 # Images and static assets
│   ├── App.jsx                 # Main application component
│   ├── App.css                 # Application styles
│   ├── fileProcessor.js        # Answer key parsing logic
│   └── main.jsx               # Application entry point
├── public/                     # Static public assets
├── index.html                  # HTML template
├── package.json               # Dependencies and scripts
├── vite.config.js             # Vite configuration
└── README.md                  # This file
```

## 🔧 Configuration

### Environment Variables
No environment variables are required for basic functionality.

### Customization
- **Branding**: Update logos and colors in `src/App.css`
- **Content**: Modify reading passages in `src/App.jsx`
- **Styling**: Customize appearance using Tailwind CSS classes

## 📚 Usage Guide

### Creating Tests
1. Click "Test Manager" in the header
2. Enter a test name (e.g., "IELTS Academic Test 2")
3. Click "+" to create the test
4. Switch between tests by clicking on test names

### Adding Answer Keys
1. Select a test from Test Manager
2. Click "Answer Key" in the header
3. Upload JSON, PDF, or DOC/DOCX files
4. System automatically parses and loads answers

### Answer Key Formats

#### JSON Format
```json
{
  "1": "FALSE",
  "2": "NOT GIVEN",
  "7": "thorium",
  "14": "B",
  "18": ["A", "B"]
}
```

#### Document Format
```
1. FALSE
2. NOT GIVEN
7. thorium
14. B
18. A, B
```

### Student Workflow
1. **Select Text**: Highlight important passages
2. **Choose Colors**: Use 6 different highlight colors
3. **Add Notes**: Create contextual notes from selected text
4. **Answer Questions**: Complete all question types
5. **Get Graded**: Receive automatic IELTS Band scores

## 🌐 Deployment Options

### Vercel (Recommended)
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Deploy automatically with custom domain support

### Netlify
1. Drag and drop `dist/` folder to Netlify
2. Or connect GitHub repository for automatic deployments
3. Configure custom domain in Netlify settings

### Traditional Web Hosting
1. Run `npm run build`
2. Upload `dist/` folder contents to web server
3. Configure web server to serve `index.html` for all routes

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🔒 Security Considerations

- All data is stored locally in browser localStorage
- No sensitive information is transmitted to external servers
- File uploads are processed client-side only
- HTTPS recommended for production deployments

## 🐛 Troubleshooting

### Common Issues

**Dependencies not installing**
- Ensure Node.js 18+ is installed
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall

**Build fails**
- Check for syntax errors in modified files
- Ensure all imports are correctly referenced
- Verify file paths are correct

**Answer key upload not working**
- Check file format (JSON, PDF, DOC/DOCX supported)
- Verify file contains properly formatted answers
- Check browser console for error messages

### Performance Optimization

- Use `npm run build` for production
- Enable gzip compression on web server
- Implement CDN for static assets
- Consider lazy loading for large components

## 📄 License

This project is provided as-is for educational purposes.

## 🤝 Support

For technical support or questions:
1. Check this README for common solutions
2. Review browser console for error messages
3. Verify all dependencies are properly installed
4. Ensure file formats match expected patterns

## 🔄 Updates and Maintenance

### Updating Dependencies
```bash
npm update
# or
yarn upgrade
# or
pnpm update
```

### Adding New Features
- Follow existing code patterns in `src/App.jsx`
- Use Tailwind CSS for styling consistency
- Test thoroughly before deployment
- Update this README with new features

---

**Version**: 1.0.0  
**Last Updated**: August 2025  
**Compatibility**: Node.js 18+, Modern browsers (Chrome, Firefox, Safari, Edge)

