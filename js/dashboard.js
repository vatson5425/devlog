/* =========================================================
   DevLog Dashboard
   Module 5 - Authentication & User Dashboard
   ========================================================= */

const DASHBOARD_API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : 'https://devlog-api.onrender.com/api'; // ← update to your deployed backend URL

let dashboardBlogs = [];


/* =========================================================
   BASIC HELPERS
   ========================================================= */

function $(selector) {
  return document.querySelector(selector);
}


function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function getToken() {
  return localStorage.getItem("devlogToken") || localStorage.getItem("blogcraftToken");
}


function showToast(message, type = "success") {

  if (
    window.Toast &&
    typeof window.Toast.show === "function"
  ) {
    window.Toast.show(message, type);
    return;
  }

  console.log(`[${type}] ${message}`);
}


/* =========================================================
   AUTH FAILURE
   ========================================================= */

function handleAuthFailure(
  message = "Session expired. Please login again."
) {

  localStorage.removeItem("devlogToken");
  localStorage.removeItem("blogcraftToken");

  showToast(message, "error");

  setTimeout(() => {
    window.location.href = "login.html";
  }, 500);
}


/* =========================================================
   NORMALIZE BLOG
   ========================================================= */

function normalizeDashboardBlog(
  blog,
  fallbackUser = {}
) {

  const authorName =
    typeof blog.author === "object"
      ? (
        blog.author?.name ||
        fallbackUser?.name ||
        "DevLog Author"
      )
      : (
        blog.author ||
        fallbackUser?.name ||
        "DevLog Author"
      );


  const authorEmail =
    typeof blog.author === "object"
      ? (
        blog.author?.email ||
        fallbackUser?.email ||
        ""
      )
      : (
        fallbackUser?.email ||
        ""
      );


  const initials =
    authorName
      .split(" ")
      .filter(Boolean)
      .map(name => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();


  const plainText =
    String(blog.content || "")
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();


  return {

    id:
      blog._id ||
      blog.id,

    title:
      blog.title ||
      "Untitled Article",

    category:
      blog.category ||
      "General",

    description:
      blog.description ||
      plainText.slice(0, 180) ||
      "Read this article on DevLog.",

    content:
      blog.content ||
      "",

    tags:
      Array.isArray(blog.tags)
        ? blog.tags
        : [],

    image:
      blog.image ||
      null,

    author:
      authorName,

    authorInitials:
      initials ||
      "DL",

    authorEmail:
      authorEmail,

    date:
      blog.createdAt ||
      blog.date ||
      new Date().toISOString(),

    status:
      blog.status ||
      "published",

    views:
      Number(blog.views || 0),

    userId:
      typeof blog.author === "object"
        ? blog.author?._id
        : blog.author
  };
}


/* =========================================================
   FETCH LOGGED-IN USER BLOGS
   ========================================================= */

async function fetchMyBlogs(user) {

  const token = getToken();


  if (!token) {

    handleAuthFailure();

    return [];
  }


  try {

    const response =
      await fetch(
        `${DASHBOARD_API_BASE_URL}/blogs/my`,
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );


    if (response.status === 401) {

      handleAuthFailure();

      return [];
    }


    if (!response.ok) {

      throw new Error(
        `HTTP ${response.status}`
      );
    }


    const data =
      await response.json();


    if (!Array.isArray(data.blogs)) {

      throw new Error(
        "Invalid blogs response"
      );
    }


    dashboardBlogs =
      data.blogs.map(blog =>
        normalizeDashboardBlog(
          blog,
          user
        )
      );


    console.log(
      "DevLog: My blogs loaded:",
      dashboardBlogs.length
    );


    return dashboardBlogs;


  } catch (error) {

    console.error(
      "DevLog: Failed to load my blogs:",
      error
    );


    dashboardBlogs = [];


    showToast(
      "Unable to load your articles.",
      "error"
    );


    return [];
  }
}


/* =========================================================
   GET USER INITIALS
   ========================================================= */

function getUserInitials(userName) {

  return String(userName || "DevLog User")
    .split(" ")
    .filter(Boolean)
    .map(name => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "DL";
}


/* =========================================================
   GET GREETING
   ========================================================= */

function getGreeting() {

  const hour =
    new Date().getHours();


  if (hour < 12) {
    return "Good Morning";
  }


  if (hour < 17) {
    return "Good Afternoon";
  }


  return "Good Evening";
}


/* =========================================================
   UPDATE USER INFORMATION
   ========================================================= */

function updateDashboardUser(user) {

  const userName =
    user?.name ||
    "DevLog User";

  const userEmail =
    user?.email ||
    "";

  const initials =
    getUserInitials(userName);


  /* =====================================================
     USER NAME
     ===================================================== */

  const nameSelectors = [
    "#headerUserName",
    "#profileName",
    "#greetingName",
    ".user-name",
    ".profile-name",
    ".userName",
    "[data-user-name]"
  ];

  nameSelectors.forEach(selector => {

    document
      .querySelectorAll(selector)
      .forEach(element => {

        element.textContent =
          userName;

      });

  });


  /* =====================================================
     USER EMAIL
     ===================================================== */

  const emailSelectors = [
    "#profileEmail",
    ".user-email",
    ".profile-email",
    ".userEmail",
    "[data-user-email]"
  ];

  emailSelectors.forEach(selector => {

    document
      .querySelectorAll(selector)
      .forEach(element => {

        element.textContent =
          userEmail;

      });

  });


  /* =====================================================
     INITIALS / AVATAR
     ===================================================== */

  const avatarSelectors = [
    "#userInitials",
    "#profileInitials",
    ".user-avatar",
    ".profile-avatar",
    ".avatar",
    ".user-initials",
    "[data-user-initials]"
  ];

  avatarSelectors.forEach(selector => {

    document
      .querySelectorAll(selector)
      .forEach(element => {

        element.textContent =
          initials;

      });

  });


  /* =====================================================
     REPLACE REMAINING "Loading..." TEXT
     ===================================================== */

  document
    .querySelectorAll("*")
    .forEach(element => {

      if (element.children.length > 0) {
        return;
      }

      const text =
        element.textContent
          .trim();

      if (text === "Loading...") {

        /*
         * If the element is inside an email-looking
         * container, use email.
         */
        const parentText =
          element.parentElement
            ?.textContent
            ?.toLowerCase() || "";

        if (
          parentText.includes("@")
        ) {

          element.textContent =
            userEmail;

        } else {

          element.textContent =
            userName;

        }

      }

    });


  /* =====================================================
     GREETING
     ===================================================== */

  const greeting =
    getGreeting();

  const greetingCandidates =
    document.querySelectorAll(
      "header h1, header h2, header h3, .greeting, .welcome-text"
    );

  greetingCandidates.forEach(element => {

    const text =
      element.textContent
        .trim()
        .toLowerCase();

    if (
      text.includes("good day") ||
      text.includes("good morning") ||
      text.includes("good afternoon") ||
      text.includes("good evening")
    ) {

      element.textContent =
        `${greeting}, ${userName} 👋`;

    }

  });


  console.log(
    "DevLog: Dashboard user loaded:",
    userName,
    userEmail
  );
}

/* =========================================================
   DASHBOARD INITIALIZATION
   ========================================================= */

async function initDashboard() {

  const dashboardPage =
    document.getElementById(
      "dashboardPage"
    );


  if (!dashboardPage) {
    return;
  }


  /* -----------------------------------------------------
     AUTH
     ----------------------------------------------------- */

  const user =
    requireAuth("login.html");


  if (!user) {
    return;
  }


  /* -----------------------------------------------------
     USER INFORMATION
     ----------------------------------------------------- */

  updateDashboardUser(user);


  /* -----------------------------------------------------
     LOAD ONLY USER BLOGS
     ----------------------------------------------------- */

  await fetchMyBlogs(user);


  /* -----------------------------------------------------
     RENDER
     ----------------------------------------------------- */

  loadStats();

  loadContentTable();

  updateMyArticlesBadge();

  initSidebar();


  console.log(
    "DevLog dashboard — logged-in user articles:",
    dashboardBlogs.length
  );
}


/* =========================================================
   DASHBOARD STATISTICS
   ========================================================= */

function loadStats() {

  const all =
    dashboardBlogs;


  const totalArticles =
    all.length;


  const published =
    all.filter(article =>
      String(
        article.status ||
        "published"
      ).toLowerCase() ===
      "published"
    ).length;


  const drafts =
    all.filter(article =>
      String(
        article.status ||
        ""
      ).toLowerCase() ===
      "draft"
    ).length;


  const totalViews =
    all.reduce(
      (sum, article) =>
        sum +
        Number(
          article.views ||
          0
        ),
      0
    );


  /* -----------------------------------------------------
     First try common IDs
     ----------------------------------------------------- */

  const totalEl =
    document.getElementById(
      "totalArticles"
    );


  const publishedEl =
    document.getElementById(
      "publishedArticles"
    );


  const draftsEl =
    document.getElementById(
      "draftArticles"
    );


  const viewsEl =
    document.getElementById(
      "totalViews"
    );


  if (totalEl) {
    totalEl.textContent =
      totalArticles;
  }


  if (publishedEl) {
    publishedEl.textContent =
      published;
  }


  if (draftsEl) {
    draftsEl.textContent =
      drafts;
  }


  if (viewsEl) {
    viewsEl.textContent =
      totalViews;
  }


  /* -----------------------------------------------------
     Find stat cards from the actual page
     ----------------------------------------------------- */

  updateStatCardsByVisibleText(
    totalArticles,
    published,
    drafts,
    totalViews
  );


  updateMyArticlesBadge();
}


/* =========================================================
   UPDATE STAT CARDS ROBUSTLY
   ========================================================= */

function updateStatCardsByVisibleText(
  total,
  published,
  drafts,
  views
) {

  /*
   * The screenshot shows the four values as "—".
   * We locate those value elements and replace them
   * in dashboard order.
   */

  const dashElements =
    Array.from(
      document.querySelectorAll("*")
    ).filter(element => {

      if (
        element.children.length > 0
      ) {
        return false;
      }


      const text =
        element.textContent.trim();


      return (
        text === "—" ||
        text === "-"
      );
    });


  /*
   * Remove duplicate nested matches
   * and only use the first four.
   */

  const values = [
    total,
    published,
    drafts,
    views
  ];


  dashElements
    .slice(0, 4)
    .forEach(
      (element, index) => {

        element.textContent =
          values[index];
      }
    );


  /*
   * Additional class-based support.
   */

  const valueElements =
    document.querySelectorAll(
      ".stat-value, .stat-number, .stat-count"
    );


  if (
    valueElements.length >= 4
  ) {

    valueElements[0].textContent =
      total;

    valueElements[1].textContent =
      published;

    valueElements[2].textContent =
      drafts;

    valueElements[3].textContent =
      views;
  }
}


/* =========================================================
   MY ARTICLES BADGE
   ========================================================= */

function updateMyArticlesBadge() {

  const count = dashboardBlogs.length;

  console.log(
    "DevLog: Updating My Articles badge:",
    count
  );



  /*
   * -------------------------------------------------------
   * 1. Direct ID support
   * -------------------------------------------------------
   */

  const directBadge =
    document.getElementById("myArticlesCount");

  if (directBadge) {
    directBadge.textContent = count;
  }


  /*
   * -------------------------------------------------------
   * 2. Find "My Articles" anywhere in sidebar
   * -------------------------------------------------------
   *
   * We don't depend on .sidebar-link because the actual
   * dashboard HTML may use another class name.
   */

  const sidebarElements =
    document.querySelectorAll(
      "a, button, li, div, span"
    );


  sidebarElements.forEach(element => {

    const text =
      element.textContent
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();


    /*
     * We only want the element whose text is
     * exactly "My Articles" or starts with it.
     */

    if (
      text === "my articles" ||
      text.startsWith("my articles ")
    ) {

      /*
       * Look for the badge inside this element.
       */

      let badge =
        element.querySelector(
          ".badge, .count, [class*='badge'], [class*='count']"
        );


      /*
       * If the badge isn't inside the element,
       * check its parent.
       */

      if (!badge && element.parentElement) {

        badge =
          element.parentElement.querySelector(
            ".badge, .count, [class*='badge'], [class*='count']"
          );
      }


      /*
       * Update existing badge.
       */

      if (badge) {

        badge.textContent =
          count;

        console.log(
          "DevLog: My Articles badge updated:",
          count
        );

        return;
      }
    }
  });


  /*
   * -------------------------------------------------------
   * 3. Extra fallback
   * -------------------------------------------------------
   *
   * Find the sidebar item containing "My Articles"
   * and update its last numeric-looking badge.
   */

  const allLinks =
    document.querySelectorAll(
      "a, button, li"
    );


  allLinks.forEach(link => {

    const text =
      link.textContent
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();


    if (
      text.includes("my articles")
    ) {

      const possibleBadges =
        link.querySelectorAll(
          "span, div"
        );


      possibleBadges.forEach(item => {

        const itemText =
          item.textContent.trim();


        /*
         * Existing static badge such as "8"
         */

        if (
          /^\d+$/.test(itemText)
        ) {

          item.textContent =
            count;

          console.log(
            "DevLog: Static My Articles badge replaced:",
            count
          );
        }
      });
    }
  });
}
/* =========================================================
   ARTICLE TABLE
   ========================================================= */

function loadContentTable() {

  const tableBody =
    document.getElementById("contentTableBody");


  if (!tableBody) {

    console.warn(
      "DevLog: Dashboard table body not found."
    );

    return;
  }


  tableBody.innerHTML = "";


  /* -----------------------------------------------------
     EMPTY
     ----------------------------------------------------- */

  if (
    dashboardBlogs.length ===
    0
  ) {

    tableBody.innerHTML = `
            <tr>
                <td
                    colspan="5"
                    style="
                        text-align:center;
                        padding:40px 20px;
                    "
                >
                    <span>
                        No articles yet.
                    </span>

                    <a
                        href="create-blog.html"
                        style="
                            color:#7c7cff;
                            text-decoration:none;
                            margin-left:5px;
                        "
                    >
                        Create your first article →
                    </a>
                </td>
            </tr>
        `;

    return;
  }


  /* -----------------------------------------------------
     ARTICLES
     ----------------------------------------------------- */

  dashboardBlogs.forEach(
    article => {

      const row =
        document.createElement(
          "tr"
        );


      const date =
        formatArticleDate(
          article.date
        );


      const status =
        String(
          article.status ||
          "published"
        ).toLowerCase();


      const statusLabel =
        status === "draft"
          ? "Draft"
          : "Published";


      const safeId =
        escapeHTML(
          article.id
        );


      row.innerHTML = `

                <td
                    class="article-title-cell"
                    style="
                        min-width:280px;
                        max-width:430px;
                    "
                >

                    <div
                        class="article-title"
                        style="
                            font-weight:600;
                            line-height:1.4;
                            white-space:normal;
                            overflow-wrap:anywhere;
                        "
                    >
                        ${escapeHTML(
        article.title
      )}
                    </div>

                </td>


                <td>

                    <span
                        class="category-badge"
                    >
                        ${escapeHTML(
        article.category
      )}
                    </span>

                </td>


                <td>

                    <span
                        class="status-badge ${status === "draft"
          ? "draft"
          : "published"
        }"
                    >
                        ${statusLabel}
                    </span>

                </td>


                <td>
                    ${date}
                </td>


                <td>

                    <div
                        class="article-actions"
                        style="
                            display:flex;
                            align-items:center;
                            gap:8px;
                            white-space:nowrap;
                        "
                    >

                        <button
                            type="button"
                            class="action-btn view-btn"
                            data-id="${safeId}"
                            style="
                                padding:8px 14px;
                                border-radius:10px;
                                border:1px solid rgba(124,124,255,.5);
                                background:transparent;
                                color:#ffffff;
                                cursor:pointer;
                                font-size:14px;
                            "
                        >
                            View
                        </button>


                        <button
                            type="button"
                            class="action-btn edit-btn"
                            data-id="${safeId}"
                            style="
                                padding:8px 14px;
                                border-radius:10px;
                                border:1px solid rgba(255,255,255,.15);
                                background:#20283c;
                                color:#ffffff;
                                cursor:pointer;
                                font-size:14px;
                            "
                        >
                            Edit
                        </button>


                        <button
                            type="button"
                            class="action-btn delete-btn"
                            data-id="${safeId}"
                            style="
                                padding:8px 14px;
                                border-radius:10px;
                                border:1px solid rgba(255,80,100,.45);
                                background:transparent;
                                color:#ff647c;
                                cursor:pointer;
                                font-size:14px;
                            "
                        >
                            Delete
                        </button>

                    </div>

                </td>
            `;


      tableBody.appendChild(
        row
      );
    }
  );


  /* -----------------------------------------------------
     VIEW
     ----------------------------------------------------- */

  tableBody
    .querySelectorAll(
      ".view-btn"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const id =
            button.dataset.id;

          window.location.href =
            `details.html?id=${encodeURIComponent(id)}`;
        }
      );
    });


  /* -----------------------------------------------------
     EDIT
     ----------------------------------------------------- */

  tableBody
    .querySelectorAll(
      ".edit-btn"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const id =
            button.dataset.id;


          window.location.href =
            `create.html?id=${encodeURIComponent(id)}`;
        }
      );
    });


  /* -----------------------------------------------------
     DELETE
     ----------------------------------------------------- */

  tableBody
    .querySelectorAll(
      ".delete-btn"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          deleteArticle(
            button.dataset.id
          );
        }
      );
    });
}


/* =========================================================
   FORMAT DATE
   ========================================================= */

function formatArticleDate(
  dateValue
) {

  if (!dateValue) {
    return "-";
  }


  const date =
    new Date(dateValue);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "-";
  }


  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric"
    }
  );
}


/* =========================================================
   DELETE ARTICLE
   ========================================================= */

async function deleteArticle(id) {

  const article =
    dashboardBlogs.find(
      item =>
        String(item.id) ===
        String(id)
    );


  if (!article) {

    showToast(
      "Article not found.",
      "error"
    );

    return;
  }


  const confirmed =
    window.confirm(
      `Are you sure you want to delete "${article.title}"?`
    );


  if (!confirmed) {
    return;
  }


  const token =
    getToken();


  if (!token) {

    handleAuthFailure();

    return;
  }


  try {

    const response =
      await fetch(
        `${DASHBOARD_API_BASE_URL}/blogs/${encodeURIComponent(id)}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );


    if (
      response.status ===
      401
    ) {

      handleAuthFailure();

      return;
    }


    const data =
      await response
        .json()
        .catch(
          () => ({})
        );


    if (!response.ok) {

      throw new Error(
        data.message ||
        `HTTP ${response.status}`
      );
    }


    /* -------------------------------------------------
       Remove from dashboard
       ------------------------------------------------- */

    dashboardBlogs =
      dashboardBlogs.filter(
        item =>
          String(item.id) !==
          String(id)
      );


    /* -------------------------------------------------
       Remove local copy
       ------------------------------------------------- */

    if (
      window.ContentDB &&
      typeof ContentDB.deleteContent ===
      "function"
    ) {

      try {

        ContentDB.deleteContent(
          id
        );

      } catch (error) {

        console.warn(
          "ContentDB delete failed:",
          error
        );
      }
    }


    /* -------------------------------------------------
       Refresh
       ------------------------------------------------- */

    loadStats();

    loadContentTable();

    updateMyArticlesBadge();


    showToast(
      "Article deleted successfully.",
      "success"
    );


  } catch (error) {

    console.error(
      "Delete article error:",
      error
    );


    showToast(
      error.message ||
      "Failed to delete article.",
      "error"
    );
  }
}


/* =========================================================
   SIDEBAR
   ========================================================= */

function initSidebar() {

  /* -----------------------------------------------------
     LOGOUT
     ----------------------------------------------------- */

  const logoutButtons =
    document.querySelectorAll(
      ".logout-link, #logoutBtn, [data-action='logout']"
    );


  logoutButtons.forEach(
    button => {

      /*
       * Avoid registering twice.
       */

      if (
        button.dataset.dashboardLogoutBound ===
        "true"
      ) {
        return;
      }


      button.dataset.dashboardLogoutBound =
        "true";


      button.addEventListener(
        "click",
        event => {

          event.preventDefault();


          if (
            typeof logout ===
            "function"
          ) {

            logout();

            return;
          }


          localStorage.removeItem(
            "devlogToken"
          );
          localStorage.removeItem(
            "blogcraftToken"
          );


          window.location.href =
            "login.html";
        }
      );
    }
  );
}


/* =========================================================
   CREATE / EDIT PAGE
   ========================================================= */

async function initCreatePage() {

  const createPage =
    document.getElementById(
      "createPage"
    );


  if (!createPage) {
    return;
  }


  /* -----------------------------------------------------
     AUTH
     ----------------------------------------------------- */

  const user =
    requireAuth("login.html");


  if (!user) {
    return;
  }


  const form =
    document.getElementById(
      "createForm"
    );


  if (!form) {
    return;
  }


  /* -----------------------------------------------------
     FORM ELEMENTS
     ----------------------------------------------------- */

  const titleInput =
    document.getElementById(
      "artTitle"
    );


  const categoryInput =
    document.getElementById(
      "artCategory"
    );


  const descriptionInput =
    document.getElementById(
      "artDesc"
    );


  const contentInput =
    document.getElementById(
      "artContent"
    );


  const statusInput =
    document.getElementById(
      "artStatus"
    );


  const tagsWrap =
    document.getElementById(
      "tagsWrap"
    );


  const imageUploadArea =
    document.getElementById(
      "imageUploadArea"
    );


  const imageInput =
    document.getElementById(
      "imageInput"
    );


  const imagePreview =
    document.getElementById(
      "imagePreview"
    );


  const previewImg =
    document.getElementById(
      "previewImg"
    );


  const removeImgBtn =
    document.getElementById(
      "removeImgBtn"
    );


  const saveDraftBtn =
    document.getElementById(
      "saveDraftBtn"
    );


  const publishBtn =
    document.getElementById(
      "publishBtn"
    );


  /* -----------------------------------------------------
     EDIT ID
     ----------------------------------------------------- */

  const params =
    new URLSearchParams(
      window.location.search
    );


  const editId =
    params.get("id");


  let existing = null;


  /* -----------------------------------------------------
     LOAD EDIT ARTICLE
     ----------------------------------------------------- */

  if (editId) {

    const myBlogs =
      await fetchMyBlogs(
        user
      );


    existing =
      myBlogs.find(
        article =>
          String(article.id) ===
          String(editId)
      );


    /*
     * Security:
     * User can only edit their own blog.
     */

    if (!existing) {

      showToast(
        "Article not found or you are not authorized to edit it.",
        "error"
      );


      setTimeout(() => {

        window.location.href =
          "dashboard.html";

      }, 700);


      return;
    }
  }


  /* -----------------------------------------------------
     POPULATE EDIT FORM
     ----------------------------------------------------- */

  if (existing) {

    if (titleInput) {

      titleInput.value =
        existing.title;
    }


    if (categoryInput) {

      categoryInput.value =
        existing.category;
    }


    if (descriptionInput) {

      descriptionInput.value =
        existing.description ||
        "";
    }


    if (contentInput) {

      contentInput.value =
        existing.content ||
        "";
    }


    if (statusInput) {

      statusInput.value =
        existing.status ||
        "published";
    }


    if (
      existing.image &&
      previewImg &&
      imagePreview
    ) {

      previewImg.src =
        existing.image;

      imagePreview.style.display =
        "block";
    }
  }


  /* =====================================================
     TAGS
     ===================================================== */

  let selectedTags =
    existing &&
      Array.isArray(existing.tags)
      ? [...existing.tags]
      : [];


  function renderTags() {

    if (!tagsWrap) {
      return;
    }


    const oldInput =
      tagsWrap.querySelector(
        "input"
      );


    const inputHTML =
      oldInput
        ? oldInput.outerHTML
        : `
                    <input
                        type="text"
                        id="tagInput"
                        placeholder="Add tag and press Enter"
                    >
                `;


    tagsWrap.innerHTML =
      "";


    selectedTags.forEach(
      (tag, index) => {

        const tagElement =
          document.createElement(
            "span"
          );


        tagElement.className =
          "tag-item";


        tagElement.innerHTML = `
                    ${escapeHTML(tag)}

                    <button
                        type="button"
                        class="remove-tag"
                        data-index="${index}"
                    >
                        ×
                    </button>
                `;


        tagsWrap.appendChild(
          tagElement
        );
      }
    );


    tagsWrap.insertAdjacentHTML(
      "beforeend",
      inputHTML
    );


    const input =
      tagsWrap.querySelector(
        "input"
      );


    if (input) {

      input.addEventListener(
        "keydown",
        event => {

          if (
            event.key !==
            "Enter"
          ) {
            return;
          }


          event.preventDefault();


          const value =
            input.value.trim();


          if (
            !value ||
            selectedTags.includes(
              value
            )
          ) {
            return;
          }


          selectedTags.push(
            value
          );


          renderTags();
        }
      );
    }


    tagsWrap
      .querySelectorAll(
        ".remove-tag"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              const index =
                Number(
                  button.dataset.index
                );


              selectedTags.splice(
                index,
                1
              );


              renderTags();
            }
          );
        }
      );
  }


  renderTags();


  /* =====================================================
     IMAGE UPLOAD
     ===================================================== */

  if (
    imageUploadArea &&
    imageInput
  ) {

    imageUploadArea.addEventListener(
      "click",
      () => {

        imageInput.click();
      }
    );


    imageInput.addEventListener(
      "change",
      () => {

        const file =
          imageInput.files?.[0];


        if (!file) {
          return;
        }


        if (
          !file.type.startsWith(
            "image/"
          )
        ) {

          showToast(
            "Please select an image file.",
            "error"
          );


          imageInput.value =
            "";


          return;
        }


        const reader =
          new FileReader();


        reader.onload =
          event => {

            if (
              previewImg &&
              imagePreview
            ) {

              previewImg.src =
                event.target.result;


              imagePreview.style.display =
                "block";
            }
          };


        reader.readAsDataURL(
          file
        );
      }
    );
  }


  /* =====================================================
     REMOVE IMAGE
     ===================================================== */

  if (removeImgBtn) {

    removeImgBtn.addEventListener(
      "click",
      event => {

        event.preventDefault();

        event.stopPropagation();


        if (imageInput) {
          imageInput.value =
            "";
        }


        if (previewImg) {
          previewImg.src =
            "";
        }


        if (imagePreview) {

          imagePreview.style.display =
            "none";
        }
      }
    );
  }


  /* =====================================================
     IMAGE VALUE
     ===================================================== */

  function getImageValue() {

    if (
      previewImg &&
      previewImg.src &&
      previewImg.src !==
      window.location.href
    ) {

      return previewImg.src;
    }


    if (
      existing &&
      existing.image
    ) {

      return existing.image;
    }


    return null;
  }


  /* =====================================================
     BUTTON STATE
     ===================================================== */

  function setSavingState(
    isSaving,
    button
  ) {

    if (!button) {
      return;
    }


    if (isSaving) {

      button.disabled =
        true;


      button.dataset.originalText =
        button.textContent;


      button.textContent =
        "Saving...";


    } else {

      button.disabled =
        false;


      button.textContent =
        button.dataset.originalText ||
        button.textContent;
    }
  }


  /* =====================================================
     SAVE ARTICLE
     ===================================================== */

  async function saveArticle(
    requestedStatus
  ) {

    const title =
      titleInput?.value.trim() ||
      "";


    const category =
      categoryInput?.value.trim() ||
      "General";


    const description =
      descriptionInput?.value.trim() ||
      "";


    const content =
      contentInput?.value.trim() ||
      "";


    const status =
      requestedStatus ||
      statusInput?.value ||
      "published";


    /* -------------------------------------------------
       VALIDATION
       ------------------------------------------------- */

    if (!title) {

      showToast(
        "Please enter an article title.",
        "error"
      );


      titleInput?.focus();


      return;
    }


    if (!content) {

      showToast(
        "Please enter article content.",
        "error"
      );


      contentInput?.focus();


      return;
    }


    const token =
      getToken();


    if (!token) {

      handleAuthFailure();

      return;
    }


    const image =
      getImageValue();


    /*
     * Backend Blog model currently accepts:
     * title, content, category, image
     */

    const payload = {

      title,

      content,

      category,

      image
    };


    const isEditing =
      Boolean(existing);


    const url =
      isEditing
        ? `${DASHBOARD_API_BASE_URL}/blogs/${encodeURIComponent(existing.id)}`
        : `${DASHBOARD_API_BASE_URL}/blogs`;


    const method =
      isEditing
        ? "PUT"
        : "POST";


    const button =
      status === "draft"
        ? saveDraftBtn
        : publishBtn;


    setSavingState(
      true,
      button
    );


    try {

      const response =
        await fetch(
          url,
          {
            method,

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`
            },

            body:
              JSON.stringify(
                payload
              )
          }
        );


      if (
        response.status ===
        401
      ) {

        handleAuthFailure();

        return;
      }


      const data =
        await response
          .json()
          .catch(
            () => ({})
          );


      if (!response.ok) {

        throw new Error(
          data.message ||
          `HTTP ${response.status}`
        );
      }


      /*
       * Keep local ContentDB synchronized
       * when available.
       */

      if (
        window.ContentDB &&
        typeof ContentDB.saveContent ===
        "function"
      ) {

        try {

          const backendBlog =
            data.blog ||
            data.article ||
            data;


          const normalized =
            normalizeDashboardBlog(
              backendBlog,
              user
            );


          ContentDB.saveContent({

            id:
              normalized.id,

            title,

            category,

            description,

            content,

            tags:
              [...selectedTags],

            image,

            author:
              user.name ||
              "DevLog Author",

            authorEmail:
              user.email ||
              "",

            date:
              normalized.date ||
              new Date().toISOString(),

            status,

            views:
              normalized.views ||
              0,

            userId:
              normalized.userId ||
              user.id

          });

        } catch (error) {

          console.warn(
            "ContentDB local save failed:",
            error
          );
        }
      }


      showToast(
        isEditing
          ? "Article updated successfully."
          : "Article created successfully.",
        "success"
      );


      setTimeout(() => {

        window.location.href =
          "dashboard.html";

      }, 500);


    } catch (error) {

      console.error(
        "Save article error:",
        error
      );


      showToast(
        error.message ||
        "Failed to save article.",
        "error"
      );


    } finally {

      setSavingState(
        false,
        button
      );
    }
  }


  /* =====================================================
     SAVE DRAFT
     ===================================================== */

  if (saveDraftBtn) {

    saveDraftBtn.addEventListener(
      "click",
      event => {

        event.preventDefault();

        saveArticle(
          "draft"
        );
      }
    );
  }


  /* =====================================================
     PUBLISH
     ===================================================== */

  if (publishBtn) {

    publishBtn.addEventListener(
      "click",
      event => {

        event.preventDefault();

        saveArticle(
          "published"
        );
      }
    );
  }


  /* =====================================================
     FORM SUBMIT
     ===================================================== */

  form.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      saveArticle(
        statusInput?.value ||
        "published"
      );
    }
  );
}


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    initDashboard();

    initCreatePage();
  }
);