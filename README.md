# 🏠 Journey Home

This repository contains the source code for Journey Home's donation management platform, a Next.js web application that connects furniture donors with a Connecticut nonprofit serving formerly homeless individuals. The platform features a public-facing multi-step donation form with photo uploads, an internal staff dashboard for reviewing and approving donation requests with integrated Mapbox location views, warehouse inventory management with advanced search and filtering, and role-based user access control with account approval workflows. Built with TypeScript, React 19, Tailwind CSS, and Firebase (Authentication, Firestore, Storage), the application streamlines the entire donation lifecycle from initial submission through warehouse intake and item distribution.

## 📚 Table of Contents

- [👥 Meet the Team](#meet-the-team)

- [🛠️ Project Setup](#project-setup)

- [🏗️ System Design](#system-design)

- [📝 PR Instructions](#pr-instructions)

### 👥 Meet the Team

Meet our wonderful team comprised of Product Managers, Designers, Tech Leads, Engineers, and Microsoft Mentors!

<table align="center">
  <tr>
    <td align="center" width="150">
      <a href="https://umd.hack4impact.org/">
        <img src="public/team-photos/pending-image.jpg" height="100" width="100" style="border-radius:50%;object-fit:cover;"/><br/>
        <b>Kalpana Iyer</b><br/><br/>
        <img src="https://img.shields.io/badge/👩‍💼_product_manager-007ACC?style=flat-square"/>
      </a>
    </td>
    <td align="center" width="150">
      <a href="https://umd.hack4impact.org/">
        <img src="public/team-photos/pending-image.jpg" height="100" width="100" style="border-radius:50%;object-fit:cover;"/><br/>
        <b>Laila Shakoor</b><br/><br/>
        <img src="https://img.shields.io/badge/👩‍💼_product_manager-007ACC?style=flat-square"/>
      </a>
    </td>
  </tr>
</table>

<table align="center">
  <tr>
    <td align="center" height="150" width="150">
      <a href="https://linkedin.com/in/joelchem">
        <img src="public/team-photos/Chemmanur_Joel.JPG" height="100" width="100" style="border-radius:50%;object-fit:cover;"/><br/>
        <b>Joel Chemmanur</b><br/><br/>
        <img src="https://img.shields.io/badge/🛠️_technical_lead-FF5733?style=flat-square"/>
      </a>
    </td>
    <td align="center" height="150" width="150">
      <a href="https://umd.hack4impact.org/">
        <img src="public/team-photos/pending-image.jpg" height="100" width="100" style="border-radius:50%;object-fit:cover;"/><br/>
        <b>Aarav Verma</b><br/><br/>
        <img src="https://img.shields.io/badge/🛠️_technical_lead-FF5733?style=flat-square"/>
      </a>
    </td>
  </tr>
</table>

<table align="center">
  <tr>
    <td align="center" width="150">
      <a href="https://umd.hack4impact.org/">
        <img src="public/team-photos/pending-image.jpg" height="100" width="100" style="border-radius:50%;object-fit:cover;"/><br/>
        <b>Sohayainder Kaur</b><br/><br/>
        <img src="https://img.shields.io/badge/🎨_designer-9B59B6?style=flat-square"/>
      </a>
    </td>
    <td align="center" width="150">
      <a href="https://umd.hack4impact.org/">
        <img src="public/team-photos/pending-image.jpg" height="100" width="100" style="border-radius:50%;object-fit:cover;"/><br/>
        <b>Tracy Tan</b><br/><br/>
        <img src="https://img.shields.io/badge/🎨_designer-9B59B6?style=flat-square"/>
      </a>
    </td>
    <td align="center" width="150">
      <a href="https://umd.hack4impact.org/">
        <img src="public/team-photos/pending-image.jpg" height="100" width="100" style="border-radius:50%;object-fit:cover;"/><br/>
        <b>Katie Yang</b><br/><br/>
        <img src="https://img.shields.io/badge/🎨_designer-9B59B6?style=flat-square"/>
      </a>
    </td>
  </tr>
</table>

<table align="center">
  <tr>
    <td align="center" width="150">
      <a href="https://umd.hack4impact.org/">
        <img src="public/team-photos/anya.jpg" height="100" width="100" style="border-radius:50%;object-fit:cover;"/><br/>
        <b>Anya Jain</b><br/><br/>
        <img src="https://img.shields.io/badge/💻_engineer-27AE60?style=flat-square"/>
      </a>
    </td>
    <td align="center" width="150">
      <a href="https://umd.hack4impact.org/">
        <img src="public/team-photos/Sarayu_Jilludumudi.JPG" height="100" width="100" style="border-radius:50%;object-fit:cover;"/><br/>
        <b>Sarayu Jilludumudi</b><br/><br/>
        <img src="https://img.shields.io/badge/💻_engineer-27AE60?style=flat-square"/>
      </a>
    </td>
    <td align="center" width="150">
      <a href="https://umd.hack4impact.org/">
        <img src="public/team-photos/AmberLi_Photo.png" height="100" width="100" style="border-radius:50%;object-fit:cover;"/><br/>
        <b>Amber Li</b><br/><br/>
        <img src="https://img.shields.io/badge/💻_engineer-27AE60?style=flat-square"/>
      </a>
    </td>
  </tr>
  <tr>
    <td colspan="4" align="center">
        <table align="center">
          <tr>
            <td align="center" width="150">
                <a href="https://umd.hack4impact.org/">
                <img src="public/team-photos/Savya_Miriyala.JPG" height="100" width="100" style="border-radius:50%;object-fit:cover;"/><br/>
                <b>Savya Miriyala</b><br><br>
                <img src="https://img.shields.io/badge/💻_engineer-27AE60?style=flat-square"/>
                </a>
            </td>
            <td align="center" width="150">
                <a href="https://umd.hack4impact.org/">
                <img src="public/team-photos/pending-image.jpg" height="100" width="100" style="border-radius:50%;object-fit:cover;"/><br/>
                <b>Shreyas</b><br/><br/>
                <img src="https://img.shields.io/badge/💻_engineer-27AE60?style=flat-square"/>
                </a>
            </td>
            <td align="center" width="150">
                <a href="https://umd.hack4impact.org/">
                <img src="public/team-photos/pending-image.jpg" height="100" width="100" style="border-radius:50%;object-fit:cover;"/><br/>
                <b>Anna</b><br/><br/>
                <img src="https://img.shields.io/badge/💻_engineer-27AE60?style=flat-square"/>
                </a>
            </td>
          </tr>
        </table>
    </td>
  </tr>
  <tr>
    <td colspan="4" align="center">
      <table align="center">
        <tr>
          <td align="center" width="150">
            <a href="https://umd.hack4impact.org/">
            <img src="public/team-photos/pending-image.jpg" height="100" width="100" style="border-radius:50%;object-fit:cover;"/><br/>
            <b>Alisha</b><br/><br/>
            <img src="https://img.shields.io/badge/💻_engineer-27AE60?style=flat-square"/>
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
<table align="center">
  <tr>
    <td align="center" width="150">
        <a href="https://umd.hack4impact.org/">
        <img src="public/team-photos/pending-image.jpg" height="100" width="100" style="border-radius:50%;object-fit:cover;"/><br/>
        <b>Microsoft Mentor</b><br/><br/>
        <img src="https://img.shields.io/badge/🧑‍🏫_mentor-95A5A6?style=flat-square"/>
      </a>
    </td>
  </tr>
</table>

### 🎓 Our Team Alumni

<table align="center">
  <tr>
    <td align="center" width="150">
      <a href="https://umd.hack4impact.org/">
        <img src="public/team-photos/arnav_dadarya.jpg" height="100" width="100" style="border-radius:50%;object-fit:cover;"/><br/>
        <b>Arnav Dadarya</b><br/><br/>
        <img src="https://img.shields.io/badge/🛠️_technical_lead-FF5733?style=flat-square"/>
      </a>
    </td>
    <td align="center" width="150">
      <a href="https://umd.hack4impact.org/">
        <img src="public/team-photos/ritika_pokharel.jpeg" height="100" width="100" style="border-radius:50%;object-fit:cover;"/><br/>
        <b>Ritika Pokharel</b><br/><br/>
        <img src="https://img.shields.io/badge/💻_engineer-27AE60?style=flat-square"/>
      </a>
    </td>
    <td align="center" width="150">
      <a href="https://umd.hack4impact.org/">
        <img src="public/team-photos/tanvi_tewary.jpg" height="100" width="100" style="border-radius:50%;object-fit:cover;"/><br/>
        <b>Tanvi Tewary</b><br/><br/>
        <img src="https://img.shields.io/badge/💻_engineer-27AE60?style=flat-square"/>
      </a>
    </td>
  </tr>
  <tr>
    <td colspan="4" align="center">
      <table align="center">
        <tr>
          <td align="center" width="150">
            <a href="https://umd.hack4impact.org/">
            <img src="public/team-photos/pending-image.jpg" height="100" width="100" style="border-radius:50%;object-fit:cover;"/><br/>
            <b>Jibran</b><br/><br/>
            <img src="https://img.shields.io/badge/🧑‍🏫_mentor-95A5A6?style=flat-square"/>
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

---

### 🛠️ Project Setup

<!-- TODO: Add project setup instructions -->

---

### 🏗️ System Design

<!-- TODO: Add system design documentation -->

---

### 📝 PR Instructions

<!-- TODO: Add pull request guidelines -->

