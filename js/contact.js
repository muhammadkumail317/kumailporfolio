"use strict";

/*====
    CONTACT.JS
    Muhammad Kumail Noor Portfolio ====*/

/*==== DOM ELEMENTS ====*/

const contactForm = document.getElementById("contact-form");
const submitButton = document.getElementById("submit-btn");

const formFields = {
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    subject: document.getElementById("subject"),
    message: document.getElementById("message")
};

const honeypot = document.getElementById("website");

const messageCounter =
    document.getElementById("message-counter");

/*==== EMAILJS CONFIGURATION ====*/

/*
    Replace these values with your EmailJS credentials.
*/

const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";

/*==== INITIALIZE EMAILJS ====*/

if (
    typeof emailjs !== "undefined" &&
    EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY"
) {

    emailjs.init({
        publicKey: EMAILJS_PUBLIC_KEY
    });

}

/*==== CONSTANTS ====*/

const EMAIL_PATTERN =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MESSAGE_MAX_LENGTH = 500;

let canSubmit = true;
let isSending = false;

/*==== FORM VALIDATION ====*/

function validateField(field) {

    if (!field) return false;

    const value = field.value.trim();

    field.classList.remove("valid", "invalid");

    if (value === "") {

        field.classList.add("invalid");
        return false;

    }

    if (field.type === "email") {

        if (!EMAIL_PATTERN.test(value)) {

            field.classList.add("invalid");
            return false;

        }

    }

    if (field.id === "message") {

        if (value.length < 15) {

            field.classList.add("invalid");
            return false;

        }

    }

    field.classList.add("valid");

    return true;

}

/*==== VALIDATE COMPLETE FORM ====*/

function validateForm() {

    let isValid = true;

    Object.values(formFields).forEach(field => {

        if (!validateField(field)) {

            isValid = false;

        }

    });

    if (!isValid) {

        showToast(
            "Please check the highlighted fields and try again.",
            "error"
        );

    }

    return isValid;

}

/*==== LIVE VALIDATION ====*/

Object.values(formFields).forEach(field => {

    if (!field) return;

    field.addEventListener("input", () => {

        validateField(field);

    });

    field.addEventListener("blur", () => {

        field.value = field.value.trim();

        validateField(field);

    });

});

/*==== MESSAGE CHARACTER COUNTER ====*/

if (formFields.message && messageCounter) {

    formFields.message.setAttribute(
        "maxlength",
        MESSAGE_MAX_LENGTH
    );

    messageCounter.textContent =
        `0/${MESSAGE_MAX_LENGTH}`;

    formFields.message.addEventListener("input", () => {

        const currentLength =
            formFields.message.value.length;

        messageCounter.textContent =
            `${currentLength}/${MESSAGE_MAX_LENGTH}`;

    });

}

/*==== LOADING BUTTON ====*/

function setLoading(isLoading) {

    if (!submitButton) return;

    submitButton.disabled = isLoading;

    submitButton.innerHTML = isLoading

        ? '<i class="fas fa-spinner fa-spin"></i> Sending...'

        : '<i class="fas fa-paper-plane"></i> Send Message';

}

/*==== CLEAN FORM DATA ====*/

function cleanFormData() {

    Object.values(formFields).forEach(field => {

        if (field) {

            field.value = field.value.trim();

        }

    });

}

/*==== HONEYPOT SPAM PROTECTION ====*/

function checkHoneypot() {

    if (honeypot && honeypot.value.trim() !== "") {

        console.warn("Spam submission detected.");

        showToast("Spam detected.", "error");

        return false;

    }

    return true;

}

/*==== EMAILJS SEND FUNCTION ====*/

async function sendEmailJS() {

    const {
        name,
        email,
        subject,
        message
    } = formFields;

    const templateParams = {

        from_name: name.value.trim(),

        from_email: email.value.trim(),

        subject: subject.value.trim(),

        message: message.value.trim()

    };

    if (typeof emailjs === "undefined") {

        throw new Error("EmailJS library is not loaded.");

    }

    return await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
    );

}

/*==== EMAIL ERROR HANDLER ====*/

function handleEmailError(error) {

    console.error("EmailJS Error:", error);

    let errorMessage =
        "Something went wrong. Please try again.";

    switch (error?.status) {

        case 400:
            errorMessage = "Invalid request.";
            break;

        case 401:
            errorMessage = "Email service authentication failed.";
            break;

        case 429:
            errorMessage = "Too many requests. Please try again later.";
            break;

        default:
            break;

    }

    showToast(errorMessage, "error");

}

/*==== SUBMIT COOLDOWN ====*/

function startCooldown(seconds = 10) {

    canSubmit = false;

    if (!submitButton) return;

    let remaining = seconds;

    submitButton.disabled = true;

    submitButton.innerHTML =
        `Wait ${remaining}s`;

    const timer = setInterval(() => {

        remaining--;

        if (remaining > 0) {

            submitButton.innerHTML =
                `Wait ${remaining}s`;

        }

        else {

            clearInterval(timer);

            canSubmit = true;

            submitButton.disabled = false;

            submitButton.innerHTML =
                '<i class="fas fa-paper-plane"></i> Send Message';

        }

    }, 1000);

}

/*==== FINAL FORM SUBMIT ====*/

async function handleFormSubmit(event) {

    event.preventDefault();


    /* Prevent duplicate submissions */

    if (isSending) {

        return;

    }


    /* Check cooldown */

    if (!canSubmit) {

        showToast(
            "Please wait a few seconds before sending another message.",
            "warning"
        );

        return;

    }


    /* Clean input */

    cleanFormData();


    /* Check EmailJS configuration */

    if (

        EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID" ||

        EMAILJS_TEMPLATE_ID === "YOUR_TEMPLATE_ID" ||

        EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY"

    ) {

        showToast(
            "Email service is not configured yet.",
            "error"
        );

        return;

    }


    /* Validate form BEFORE setting isSending */

    if (!validateForm()) {

        return;

    }


    /* Check honeypot */

    if (!checkHoneypot()) {

        return;

    }


    /* Start sending */

    isSending = true;

    setLoading(true);


    try {

        await sendEmailJS();


        /* SUCCESS */

        showToast(
            "Your message has been sent successfully! 🚀",
            "success"
        );


        /* Reset form */

        contactForm.reset();

        formFields.name.focus();


        /* Remove validation states */

        Object.values(formFields).forEach(field => {

            field.classList.remove(
                "valid",
                "invalid"
            );

        });


        /* Reset character counter */

        if (messageCounter) {

            messageCounter.textContent =
                `0/${MESSAGE_MAX_LENGTH}`;

        }


        /* Start cooldown */

        startCooldown();

    }


    catch (error) {

        /* EMAIL ERROR */

        handleEmailError(error);

    }


    finally {

        isSending = false;

        setLoading(false);

    }

}
/*==== NETWORK STATUS ====*/

window.addEventListener("offline", () => {

    showToast(

        "No internet connection. Please check your network.",

        "error"

    );

});

window.addEventListener("online", () => {

    showToast(

        "Internet connection restored.",

        "success"

    );

});

/*==== INITIALIZE CONTACT MODULE ====*/

document.addEventListener("DOMContentLoaded", () => {

    if (contactForm) {

        contactForm.addEventListener(

            "submit",

            handleFormSubmit

        );

    }

    console.log(

        "%cContact System Ready ✔",

        "color:#22c55e;font-size:14px;font-weight:bold;"

    );

});