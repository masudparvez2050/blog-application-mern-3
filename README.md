# BLOG APPLICATION

BLog Application is a client project developed by our team. This README file provides guidelines on setting up the project, branching strategy, commit message conventions, and contribution rules.

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/masudparvez2050/blog-application-mern-3.git
cd blog-application-mern-3
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Start the Development Server
```sh
npm run dev
```

The application should now be running at `http://localhost:3000`. (for fontend)

The application should now be running at `http://localhost:5000`. (for backend)

---

## 🌲 Branching Strategy

We follow the **Git Flow** branching model:

- `main` → **Production** (Only stable and tested code)
- `develop` → **Development Branch** (Latest features being worked on)
- `username/pagename` → **UI pages**(If you working on a page)
- `feature/{feature-name}` → **Feature Branches** (For new features)
- `fix/{bug-name}` → **Bug Fixes**
- `docs/{documentation-portion}` → **Documentation Updates**

Example:
```
masud/homepage
feature/user-authentication
fix/navbar-bug
docs/readme-update
```

---

## ✍️ Commit Message Convention

We follow the **Conventional Commits** format:

**Structure:**
```
<type>(scope): <subject>
```

**Example:**
```
design(homePage) : complete Home Page Design
feat(auth): add JWT authentication system
fix(ui): resolve navbar overlap issue on mobile
docs(readme): update installation steps
```

### Allowed Commit Types:
- **feat** → For new features
- **fix** → For bug fixes
- **docs** → For documentation updates
- **style** → Code formatting (no logic changes)
- **refactor** → Code restructuring (no functionality changes)

---

## ⚖️ Contribution Rules

Before pushing any changes, follow these steps:

1️⃣ **Pull the latest changes** before starting work:
   ```sh
   git pull origin main
   ```

2️⃣ **Create a new branch** based on the pages or features or fix:
   ```sh
   git checkout -b masud/homePage
   ```

3️⃣ **Follow coding standards** (Prettier & ESLint):
   ```sh
   npm run lint
   ```

4️⃣ **Write meaningful commit messages** using the defined convention.

5️⃣ **Create a Pull Request (PR)** for merging into `develop`.

6️⃣ **Wait for at least one approval** before merging.

---

## ❗ Important Rules
✅ Always write **clean and modular** code.
✅ Use **meaningful variable names**.
✅ Never push directly to `main` or `develop`.
✅ Always get code reviewed before merging.
✅ Use **environment variables** for sensitive information.

---

### 🔗 Contact & Support
For any issues, reach out to the project maintainers.

---

Happy Coding! 🚀🎉
