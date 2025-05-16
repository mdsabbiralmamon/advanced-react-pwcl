# Contributing to React Advanced Password Checklist (react-advanced-pwcl)

Thank you for your interest in contributing to **React Advanced Password Checklist**! Your help is appreciated and helps make this project better for everyone.

This guide will walk you through the contribution process, from reporting issues to submitting pull requests.

## Getting Started

- **Read the [README](README.md)** for an overview of the project, setup instructions, and usage.
- Familiarize yourself with the codebase by exploring the files in this repository, especially the `src/`, `examples/`, and `test/` folders.

## How to Contribute

### 1. Reporting Issues

- **Search existing issues** before opening a new one to avoid duplicates.
- If you find a bug or have a feature request, [open a new issue](https://github.com/mdsabbiralmamon/advanced-react-pwcl/issues/new) and provide as much detail as possible (steps to reproduce, expected behavior, screenshots, etc.).

### 2. Picking Up an Issue

- Browse [open issues](https://github.com/mdsabbiralmamon/advanced-react-pwcl/issues) and comment if you want to work on one.
- If you have questions or need clarification, feel free to ask in the issue thread.

### 3. Development Setup

1. **Fork** this repository and clone your fork locally.
2. **Install dependencies**:
    ```sh
    yarn install || npm i
    ```
3. **Start the development environment**:
    ```sh
    yarn start || npm start
    ```
    This will launch Storybook for interactive component development.

4. **Run tests** to ensure everything works:
    ```sh
    yarn test || npm test
    ```

> **Note:** This project requires **Node.js v14 or higher** and uses **npm** as the package manager.

### 4. Making Changes

- Create a new branch from `main` for your work:
  ```sh
  git checkout -b your-feature-name
  ```
- Make your changes in the relevant files (see `src/` for core logic, `examples/` for usage, and `test/` for tests).
- Add or update tests as needed.
- Ensure all tests pass before committing.

### 5. Commit Guidelines

- Write clear, concise commit messages.
- Follow [Conventional Commits](https://www.conventionalcommits.org/) if possible.
- Use descriptive messages (e.g., `fix: handle empty password edge case`).

### 6. Submitting a Pull Request

- Push your branch to your fork.
- Open a pull request (PR) against the `main` branch of this repository.
- Reference any related issues in your PR description.
- Ensure the PR passes all CI checks.

### 7. Code Review

- A maintainer will review your PR and may request changes.
- Respond to feedback and update your PR as needed.
- Once approved, your PR will be merged.

### 8. After Your PR is Merged

- Your contribution will be included in the next release.
- Thank you for helping improve Advanced Password Checklist! 🎉

## Additional Resources

- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Collaborating with pull requests](https://docs.github.com/en/github/collaborating-with-pull-requests)
- [Managing merge conflicts](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts)

---

If you have any questions, feel free to open an issue or start a discussion. Happy coding!