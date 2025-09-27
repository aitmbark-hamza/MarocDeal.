import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email déjà utilisé" });

    const newUser = new User({ email, password, isVerified: false });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const verificationLink = `http://localhost:5000/api/auth/verify/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Vérification de votre compte",
      html: `<h2>Bienvenue !</h2><p>Cliquez sur le lien ci-dessous pour vérifier votre email :</p><a href="${verificationLink}">${verificationLink}</a>`
    });

    res.status(201).json({ message: "Utilisateur créé. Vérifiez votre email !" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Verify route
router.get("/verify/:token", async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ message: "Utilisateur introuvable" });
    user.isVerified = true;
    await user.save();
    res.status(200).json({ message: "Votre compte est vérifié !" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Lien invalide ou expiré" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email ou mot de passe invalide" });
    if (!user.isVerified) return res.status(400).json({ message: "Compte non vérifié" });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Email ou mot de passe invalide" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token, message: "Connexion réussie" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
