const form = document.getElementById("applicationForm");
const submitBtn = document.getElementById("submitBtn");
const status = document.getElementById("status");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    status.textContent = "";
    status.className = "";

    const cv = document.getElementById("cv").files[0];

    if (!cv) {
        status.textContent = "Please upload your CV.";
        status.className = "error";
        return;
    }

    if (cv.size > 5 * 1024 * 1024) {
        status.textContent = "CV must be smaller than 5MB.";
        status.className = "error";
        return;
    }

    const formData = new FormData(form);

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    try {
        const response = await fetch("/api/applications", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Submission failed");
        }

        status.textContent =
            `✓ Application submitted successfully. ID: ${result.applicationId}`;

        status.className = "success";

        form.reset();

    } catch (error) {
        status.textContent = error.message;
        status.className = "error";
    }

    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Application";
});
