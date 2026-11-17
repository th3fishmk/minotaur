<template>
    <div id="app-container">
        <!-- Main content area -->
        <main class="main-content">
            <router-view />
        </main>
        <header class="navbar">
            <nav class="nav-links">
                <router-link to="/validated"
                    class="nav-btn">Validated</router-link>
                <router-link to="/"
                    class="nav-btn nav-btn-large">Home</router-link>
                <router-link to="/history"
                    class="nav-btn">History</router-link>
            </nav>
        </header>
    </div>
</template>

<style>
#app-container {
    min-height: 100vh;
    position: relative;
}

.main-content {
    display: flex;
    justify-content: center;
    width: 100%;
    padding-bottom: 90px;
    /* Leaves space for the bottom bar */
    padding-top: 2rem;
    flex-direction: column;
}

.navbar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(8px);
    border-top: 1px solid #e5e7eb;
    padding: 0.75rem 1rem;
    display: flex;
    justify-content: center;
    z-index: 1000;
    box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.05);
    box-sizing: border-box;
}

.nav-links {
    display: flex;
    gap: 0.5rem;
    width: 100%;
    max-width: 360px;
    /* Keeps them centered and neatly contained */
    justify-content: center;
}

.nav-btn {
    flex: 1;
    /* Forces all 3 buttons to share equal width */
    min-width: 80px;
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    /* Matches your form's .btn font size */
    font-weight: 600;
    text-align: center;
    color: #4b5563;
    background-color: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    text-decoration: none;
    user-select: none;
    transition: all 0.15s ease;
    box-sizing: border-box;
}

.nav-btn.nav-btn-large {
    flex: 1.6;
    /* Takes up more horizontal space */
    font-size: 0.95rem;
    /* Noticeably larger text */
    padding: 0.75rem 1.25rem;
    /* Chunky, easy-to-tap padding */
}

/* Hover state matching your form options style */
.nav-btn:hover {
    background-color: #dbeafe;
    border-color: #3b82f6;
    color: #1e3a8a;
}

/* Active / Current Page State */
.nav-btn.router-link-active {
    background-color: #2563eb;
    color: #ffffff;
    border-color: #2563eb;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* Active Hover State */
.nav-btn.router-link-active:hover {
    background-color: #1d4ed8;
    border-color: #1d4ed8;
}
</style>