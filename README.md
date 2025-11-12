# 📁 Project File Overview

> A structured breakdown of key frontend components and their responsibilities within the project.

---

## 🧩 Core Components

### **1. `File_Manager.tsx`**

Manages all file-related operations. This component handles every file fetched from the server and acts as the main controller for file management.

---

### **2. `Files_Tab.tsx`**

A visual component responsible for displaying files within the File Manager container. It ensures a clean and organized presentation of server files.

---

### **3. `Header.tsx`**

The top navigation bar of the page, containing:

* 🧑‍💻 User server name
* 🔍 Search bar
* 🧭 Dashboard button
* 🖼️ Profile picture
* 🚪 Logout button
* 🌙 Theme toggle button

---

### **4. `Resource.tsx`**

Fetches and displays live server statistics including:

* 🌐 Server IP
* ⏱️ Server uptime
* 🧠 RAM usage
* ⚙️ CPU usage
* 💾 Storage usage

---

### **5. `Terminal.tsx`**

Handles all console-related data and interactions.

* Displays live console output from the server
* Includes an input field for user commands (sent directly to the server)
* Within **Terminal > log**, each line of console output is rendered as a new element with the class name **`terminal_line`** — representing one console line.

---

## ⚙️ Dependencies

Make sure to install the following before running the project:

```bash
npm install react-icons --save
```

---

## ✨ Fonts

* **Global font:** [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk)
* **Terminal font:** [Inconsolata](https://fonts.google.com/specimen/Inconsolata)

Both fonts are loaded from **Google Fonts**.

---

## 🎨 Styling

This project uses **Tailwind CSS** for styling — simple, efficient, and utility-first design.

---

## 👨‍💻 Developer

**Ayan Khan**

> Passionate about clean design, structured code, and creating smooth user experiences.




change the 'Files_Tab.tsx'
change the 'Resource.tsx'
change the 'globbal.css'

work to do on after classes today----


create the file selection system
- select the files
- delete or move the file
    - also create the system for the behaviours of file moveing through the folders
- create download and delete system
- add select all / cancle / and select count header 



tokn == ptlc_uufUXL5J9II8AtVET0jCNbuqX6gUQBLirna45ZhYXZZ
server id = 430de4da

-- THis commit haave feature that render the file form the server in the file expolor and the navigate through the folder



modify the pop section do the basic ui and complete the login after this commit going to implement the login to the ui








-- selection is done function working fine and the selction login work fine as hell 
--- i can sleep now




- this commit contains the file structure creation and bit planing nothing done with code 
`commit message` -m - File structure
