"use strict";

/*==== GITHUB CONFIGURATION ====*/

const GITHUB_USERNAME = "muhammadkumail317";

/*==== DOM ELEMENTS ====*/

const githubAvatar = document.getElementById("github-avatar");
const githubName = document.getElementById("github-name");
const githubBio = document.getElementById("github-bio");
const githubFollowers = document.getElementById("github-followers");
const githubFollowing = document.getElementById("github-following");
const githubRepos = document.getElementById("github-repos");
const githubProfile = document.getElementById("github-profile");

const githubRepositories = document.getElementById("github-repositories");
const githubStars = document.getElementById("github-stars");
const githubForks = document.getElementById("github-forks");
const githubLanguages = document.getElementById("github-languages");

/*==== FETCH GITHUB PROFILE ====*/

const fetchGitHubProfile = async () => {

    try {

        const response = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}`
        );

        if (!response.ok) {
            throw new Error("GitHub profile not found.");
        }

        const data = await response.json();

        if (githubAvatar) {
            githubAvatar.src = data.avatar_url;
            githubAvatar.alt = `${data.login} GitHub Avatar`;
        }

        if (githubName) {
            githubName.textContent = data.name || data.login;
        }

        if (githubBio) {
            githubBio.textContent = data.bio || "No bio available.";
        }

        if (githubFollowers) {
            githubFollowers.textContent = data.followers;
        }

        if (githubFollowing) {
            githubFollowing.textContent = data.following;
        }

        if (githubRepos) {
            githubRepos.textContent = data.public_repos;
        }

        if (githubProfile) {
            githubProfile.href = data.html_url;
        }

    } catch (error) {

        console.error("GitHub Profile Error:", error);

    }

};

/*==== FETCH REPOSITORIES ====*/

const fetchRepositories = async () => {

    try {

        const response = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`
        );

        if (!response.ok) {
            throw new Error("Repositories not found.");
        }

        const repositories = await response.json();

        let totalStars = 0;
        let totalForks = 0;

        const languageCount = {};
        let html = "";

        repositories.forEach(repo => {

            totalStars += repo.stargazers_count;
            totalForks += repo.forks_count;

            if (repo.language) {
                languageCount[repo.language] =
                    (languageCount[repo.language] || 0) + 1;
            }

            html += `
                <div class="repo-card">

                    <h3>${repo.name}</h3>

                    <p>
                        ${repo.description || "No description available."}
                    </p>

                    <div class="repo-info">

                        <span>⭐ ${repo.stargazers_count}</span>

                        <span>🍴 ${repo.forks_count}</span>

                        <span>${repo.language || "N/A"}</span>

                    </div>

                    <a
                        href="${repo.html_url}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="btn">

                        View Repository

                    </a>

                </div>
            `;

        });

        if (githubRepositories) {
            githubRepositories.innerHTML = html;
        }

        if (githubStars) {
            githubStars.textContent = totalStars;
        }

        if (githubForks) {
            githubForks.textContent = totalForks;
        }

        if (githubLanguages) {

            githubLanguages.textContent =
                Object.keys(languageCount).join(", ") || "N/A";

        }

    } catch (error) {

        console.error("Repository Fetch Error:", error);

    }

};

/*==== INITIALIZE ====*/

document.addEventListener("DOMContentLoaded", () => {

    if (githubProfile || githubAvatar) {
        fetchGitHubProfile();
    }

    if (githubRepositories) {
        fetchRepositories();
    }

});