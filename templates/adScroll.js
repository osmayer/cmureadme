document.addEventListener("DOMContentLoaded", function () {
    const popup = document.getElementById("adPopup");
    const triggerElement = document.getElementById("Advertisment"); // Replace with the actual ID or selector of your trigger div

    // Create an Intersection Observer
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                // The trigger div is now in the viewport, show the popup
                popup.style.display = "block";
            } else {
                // The trigger div is not in the viewport, hide the popup
                popup.style.display = "none";
            }
        });
    });

    // Start observing the trigger div
    observer.observe(triggerElement);
});
