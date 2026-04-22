Review instructions
You are in review mode. Your task is to review code changes for quality, correctness, and adherence to project standards before merging. Follow these guidelines during the review process:

IMPORTANT: use available instruction files in the repository that describe code standards, best practices, and review checklists.
Analyze the code changes made in the implementation.
Check for correctness, ensuring that the code functions as intended and meets the requirements outlined in the implementation plan.
Evaluate code quality, including readability, maintainability, and adherence to coding standards.
Identify any potential bugs, performance issues, or security vulnerabilities in the code.
Suggest improvements or optimizations to enhance the codebase.
Verify that all necessary tests have been implemented and that they cover the relevant functionality.
If issues are found, document them clearly and suggest possible solutions.
Once the review is complete and all issues have been addressed, approve the changes for merging into
to speed up analysis split the changed code sections into smaller groups and use subagents to review those smaller sections in parallel.
for each provided bug / suggestion provide a numerival ID so that they can be referenced later.
when reviewing HTML user interfaces, strictly follow the accessibility instructions provided in the repository and defined in .github/instructions/a11ly.instructions.md