import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

// Store verification codes temporarily (in production, use Redis or database)
const verificationCodes = new Map();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

// Send verification code route
router.post("/send-verification", async (req, res) => {
  try {
    const { email } = req.body;
    
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store code with expiration (10 minutes)
    verificationCodes.set(email, {
      code: code,
      expires: Date.now() + 10 * 60 * 1000,
      attempts: 0
    });
    
    // Send email with verification code
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "MarocDeals - Code de vérification",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">MarocDeals - Vérification de compte</h2>
          <p>Bonjour,</p>
          <p>Votre code de vérification est :</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="color: #2563eb; font-size: 32px; margin: 0; letter-spacing: 5px;">${code}</h1>
          </div>
          <p>Ce code expire dans 10 minutes.</p>
          <p>Si vous n'avez pas demandé ce code, ignorez cet email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">MarocDeals - Votre plateforme de comparaison de prix</p>
        </div>
      `
    });
    
    res.status(200).json({ message: "Code de vérification envoyé" });
  } catch (error) {
    console.error("Error sending verification code:", error);
    res.status(500).json({ message: "Erreur lors de l'envoi du code" });
  }
});

// Verify code route
router.post("/verify-code", async (req, res) => {
  try {
    const { email, code } = req.body;
    
    const storedData = verificationCodes.get(email);
    if (!storedData) {
      return res.status(400).json({ message: "Code non trouvé ou expiré" });
    }
    
    // Check if code expired
    if (Date.now() > storedData.expires) {
      verificationCodes.delete(email);
      return res.status(400).json({ message: "Code expiré" });
    }
    
    // Check attempts (max 3)
    if (storedData.attempts >= 3) {
      verificationCodes.delete(email);
      return res.status(400).json({ message: "Trop de tentatives. Demandez un nouveau code" });
    }
    
    // Verify code
    if (storedData.code !== code) {
      storedData.attempts++;
      return res.status(400).json({ message: "Code incorrect" });
    }
    
    // Code is valid, remove it
    verificationCodes.delete(email);
    res.status(200).json({ message: "Code vérifié avec succès" });
    
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).json({ message: "Erreur lors de la vérification" });
  }
});

// Signup route (creates account after verification)
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, verified } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email déjà utilisé" });
    
    // Only create account if verified is true (from frontend verification)
    if (!verified) {
      return res.status(400).json({ message: "Vérification requise avant création du compte" });
    }

    const newUser = new User({ 
      username, 
      email, 
      password, 
      isVerified: true // Set to true since verification was done via code
    });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    
    res.status(201).json({ 
      token, 
      username: newUser.username,
      message: "Compte créé avec succès !" 
    });
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
    res.status(200).json({ 
      token, 
      username: user.username,
      message: "Connexion réussie" 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
