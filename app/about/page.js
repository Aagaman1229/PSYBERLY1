import Image from 'next/image';
import Link from 'next/link';
import { FaTwitter, FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import styles from '../../styles/About.module.css';

export default function AboutPage() {
  return (
    <div className={styles.aboutPage}>
      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>Psyberly</h1>
          <p className={styles.heroSubtitle}>
            A Nepali cybersecurity collective — learning, contributing, and leading together.
          </p>
        </section>

        {/* Story Section */}
        <section className={styles.story}>
          <h2 className={styles.storyTitle}>Our Origin</h2>
          <p className={styles.storyText}>
            Psyberly was born from a shared passion for cybersecurity and a desire to build a safer digital space in Nepal. 
            Two students, Aagaman and Anurag, realized that the best way to learn was to teach, to share, and to grow together. 
            They started this blog as a platform to document their journey, demystify complex topics, and inspire others to join 
            the fight against cyber threats.
          </p>
          <p className={styles.storyText}>
            Their vision: a community where knowledge is free, curiosity is rewarded, and every member becomes a leader. 
            From Kathmandu to the world, Psyberly is more than a blog—it's a movement.
          </p>
        </section>

        {/* Team Section */}
        <section className={styles.teamSection}>
          <h2 className={styles.teamTitle}>Meet the Team</h2>
          <div className={styles.teamGrid}>
            {/* Aagaman K.C. */}
            <div className={styles.teamCard}>
              <div className={styles.teamImageWrapper}>
                <img
                  src="/admin1.jpg"
                  alt="Aagaman K.C."
                  className={styles.teamImage}
                  width={150}
                  height={150}
                />
              </div>
              <h3 className={styles.teamName}>Aagaman K.C.</h3>
              <p className={styles.teamRole}>Cybersecurity Student</p>
              <p className={styles.teamBio}>
                Passionate about network security and ethical hacking. Loves breaking things to fix them better. 
                Believes that the best defense is a good offense.
              </p>
              <div className={styles.teamLinks}>
                <a href="#" target="_blank" rel="noopener noreferrer" className={styles.teamLink}>
                  <FaTwitter />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className={styles.teamLink}>
                  <FaGithub />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className={styles.teamLink}>
                  <FaLinkedin />
                </a>
              </div>
            </div>

            {/* Anurag Acharya */}
            <div className={styles.teamCard}>
              <div className={styles.teamImageWrapper}>
                <img
                  src="/admin2.jpg"
                  alt="Anurag Acharya"
                  className={styles.teamImage}
                  width={150}
                  height={150}
                />
              </div>
              <h3 className={styles.teamName}>Anurag Acharya</h3>
              <p className={styles.teamRole}>Cybersecurity Student</p>
              <p className={styles.teamBio}>
                Focuses on cryptography and secure coding. Believes that security is everyone's responsibility. 
                Enjoys solving puzzles and building resilient systems.
              </p>
              <div className={styles.teamLinks}>
                <a href="#" target="_blank" rel="noopener noreferrer" className={styles.teamLink}>
                  <FaTwitter />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className={styles.teamLink}>
                  <FaGithub />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className={styles.teamLink}>
                  <FaLinkedin />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Join Us Section */}
        <section className={styles.joinSection}>
          <h2 className={styles.joinTitle}>Be Part of Our Story</h2>
          <p className={styles.joinText}>
            Want to contribute, write, or research with us? We're looking for passionate minds who want to make 
            the cyber world safer. Drop us a message – we'd love to hear from you.
          </p>
          <a href="mailto:psyberly1@gmail.com" className={styles.joinButton}>
            <FaEnvelope style={{ marginRight: '0.5rem' }} /> psyberly1@gmail.com
          </a>
        </section>
      </div>
    </div>
  );
}