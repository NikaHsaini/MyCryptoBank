#!/usr/bin/env python3
"""
Script de lancement pour MyCryptoBank
Ce script permet de lancer facilement le site MyCryptoBank en mode développement ou production.
"""

import os
import sys
import subprocess
import webbrowser
import time
import argparse
from pathlib import Path

def find_project_root():
    """Trouve le répertoire racine du projet MyCryptoBank."""
    # Essayer de trouver le répertoire du projet
    current_dir = Path(os.path.dirname(os.path.abspath(__file__)))
    
    # Vérifier si nous sommes déjà dans le répertoire du projet
    if (current_dir / "package.json").exists():
        return current_dir
    
    # Vérifier si le projet est dans un sous-répertoire MCBfullV1 ou MCBfullV2
    for subdir in ["MCBfullV1", "MCBfullV2"]:
        if (current_dir / subdir / "package.json").exists():
            return current_dir / subdir
    
    # Chercher dans les répertoires parents
    for parent in current_dir.parents:
        if (parent / "package.json").exists():
            return parent
        for subdir in ["MCBfullV1", "MCBfullV2"]:
            if (parent / subdir / "package.json").exists():
                return parent / subdir
    
    print("Erreur: Impossible de trouver le répertoire du projet MyCryptoBank.")
    print("Assurez-vous que ce script est exécuté depuis le répertoire du projet ou un répertoire parent.")
    sys.exit(1)

def check_dependencies():
    """Vérifie si Node.js et npm sont installés."""
    try:
        subprocess.run(["node", "--version"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        subprocess.run(["npm", "--version"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return True
    except (subprocess.SubprocessError, FileNotFoundError):
        return False

def install_dependencies(project_root):
    """Installe les dépendances du projet."""
    print("Installation des dépendances...")
    try:
        subprocess.run(["npm", "install"], cwd=project_root, check=True)
        print("Dépendances installées avec succès.")
    except subprocess.SubprocessError:
        print("Erreur lors de l'installation des dépendances.")
        sys.exit(1)

def start_dev_server(project_root, port=None):
    """Démarre le serveur de développement."""
    print("Démarrage du serveur de développement...")
    
    # Modifier le fichier vite.config.ts si un port est spécifié
    if port:
        try:
            config_file = project_root / "vite.config.ts"
            if config_file.exists():
                with open(config_file, 'r') as f:
                    content = f.read()
                
                # Remplacer le port dans la configuration
                if "port:" in content:
                    content = content.replace(r"port: \d+", f"port: {port}")
                else:
                    # Ajouter la configuration de port si elle n'existe pas
                    content = content.replace(
                        "server: {",
                        f"server: {{\n    port: {port},"
                    )
                
                with open(config_file, 'w') as f:
                    f.write(content)
                
                print(f"Port configuré sur {port}")
        except Exception as e:
            print(f"Avertissement: Impossible de configurer le port: {e}")
    
    # Démarrer le serveur
    try:
        process = subprocess.Popen(["npm", "run", "dev"], cwd=project_root)
        
        # Attendre que le serveur démarre
        time.sleep(3)
        
        # Déterminer l'URL à ouvrir
        url = f"http://localhost:{port or 3000}"
        print(f"Serveur démarré sur {url}")
        
        # Ouvrir le navigateur
        webbrowser.open(url)
        
        print("Appuyez sur Ctrl+C pour arrêter le serveur...")
        process.wait()
    except KeyboardInterrupt:
        print("\nArrêt du serveur...")
        process.terminate()
    except subprocess.SubprocessError as e:
        print(f"Erreur lors du démarrage du serveur: {e}")
        sys.exit(1)

def build_production(project_root):
    """Construit la version de production du site."""
    print("Construction de la version de production...")
    try:
        subprocess.run(["npm", "run", "build"], cwd=project_root, check=True)
        print("Construction terminée avec succès.")
        print(f"Les fichiers de production sont disponibles dans le répertoire: {project_root}/dist")
    except subprocess.SubprocessError:
        print("Erreur lors de la construction de la version de production.")
        sys.exit(1)

def serve_production(project_root):
    """Sert la version de production du site."""
    dist_dir = project_root / "dist"
    if not dist_dir.exists():
        print("Le répertoire de distribution n'existe pas. Construction de la version de production...")
        build_production(project_root)
    
    print("Démarrage du serveur pour la version de production...")
    try:
        # Installer serve si nécessaire
        subprocess.run(["npx", "serve", "-v"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except subprocess.SubprocessError:
        print("Installation de 'serve'...")
        subprocess.run(["npm", "install", "-g", "serve"], check=True)
    
    try:
        process = subprocess.Popen(["npx", "serve", "-s", "dist"], cwd=project_root)
        
        # Attendre que le serveur démarre
        time.sleep(2)
        
        # Ouvrir le navigateur
        url = "http://localhost:3000"
        print(f"Serveur démarré sur {url}")
        webbrowser.open(url)
        
        print("Appuyez sur Ctrl+C pour arrêter le serveur...")
        process.wait()
    except KeyboardInterrupt:
        print("\nArrêt du serveur...")
        process.terminate()
    except subprocess.SubprocessError as e:
        print(f"Erreur lors du démarrage du serveur: {e}")
        sys.exit(1)

def main():
    """Fonction principale."""
    parser = argparse.ArgumentParser(description="Script de lancement pour MyCryptoBank")
    parser.add_argument("--mode", choices=["dev", "build", "serve"], default="dev",
                        help="Mode de lancement: dev (développement), build (construction), serve (servir la version de production)")
    parser.add_argument("--port", type=int, help="Port pour le serveur de développement")
    args = parser.parse_args()
    
    # Trouver le répertoire racine du projet
    project_root = find_project_root()
    print(f"Répertoire du projet: {project_root}")
    
    # Vérifier les dépendances
    if not check_dependencies():
        print("Erreur: Node.js et npm sont requis pour exécuter ce script.")
        print("Veuillez les installer avant de continuer.")
        sys.exit(1)
    
    # Vérifier si les dépendances du projet sont installées
    node_modules = project_root / "node_modules"
    if not node_modules.exists() or not os.listdir(node_modules):
        install_dependencies(project_root)
    
    # Exécuter l'action demandée
    if args.mode == "dev":
        start_dev_server(project_root, args.port)
    elif args.mode == "build":
        build_production(project_root)
    elif args.mode == "serve":
        serve_production(project_root)

if __name__ == "__main__":
    main()
