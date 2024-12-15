import React from 'react';
import Image from 'next/image';
import styles from '../styles/Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.socialLinks}>
          <a 
            href="https://github.com/notrustverify/token-furnace" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Image 
              src="/github.svg" 
              alt="GitHub" 
              width={24} 
              height={24} 
            />
          </a>
          <a 
            href="https://twitter.com/notrustverif" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Image 
              src="/twitter.svg" 
              alt="Twitter" 
              width={24} 
              height={24} 
            />
          </a>
        </div>
        <p className={styles.poweredBy}>
          Powered by <a href="https://alephium.org" target="_blank" rel="noopener noreferrer">Alephium</a>
          {' '}- Developed by <a href="https://notrustverify.ch" target="_blank" rel="noopener noreferrer">NTV</a>
        </p>
      </div>
    </footer>
  );
}; 