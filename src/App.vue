<template>
    <div id="app-container">
        <!-- Main content area -->
        <main class="main-content">
            <router-view />
        </main>

        <!-- Fixed Bottom Navigation Bar -->
        <header class="navbar">
            <nav class="nav-links">
                <router-link to="/validated"
                    class="nav-btn">Validated</router-link>
                <router-link to="/"
                    class="nav-btn">Home</router-link>
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
    padding-bottom: 80px;
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
}

.nav-links {
    display: flex;
    gap: 1rem;
}

.nav-btn {
    padding: 0.5rem 1.25rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #4b5563;
    text-decoration: none;
    border-radius: 0.375rem;
    transition: all 0.2s ease;
}

.nav-btn:hover {
    background-color: #e5e7eb;
    color: #1f2937;
}

.nav-btn.router-link-active {
    background-color: #2563eb;
    color: #ffffff;
}
</style>