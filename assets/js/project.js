document.addEventListener("DOMContentLoaded", function () {
    const projectForm = document.getElementById("create-project-form");

    projectForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(projectForm);

        fetch("/project-create", {
            method: "POST",
            body: formData,
        })
        .then(response => {
            if (response.ok) {
                window.location.href = "/projects"; // Redirect ke daftar proyek
            } else {
                console.error("Failed to create project");
            }
        })
        .catch(error => console.error("Error:", error));
    });
});
