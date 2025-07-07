import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';

export interface SkillCategory {
  name: string;
  icon: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  level: number;
  experience: string;
}

export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  description?: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  protected personalInfo = {
    firstName: 'Luc',
    lastName: 'Joosten',
    title: 'Full-Stack Developer',
    profileImage: './assets/images/profile-picture.jpg',
    location: 'Nederland',
    email: 'lhajoosten@outlook.com',
    github: 'https://github.com/lhajoosten',
    linkedin: 'https://linkedin.com/in/lhajoosten',
    cv: '/assets/cv/luc-joosten-cv.pdf',
  };

  protected aboutText = {
    introduction: `Hallo! Ik ben Luc Joosten, een gepassioneerde full-stack developer uit Nederland.
                   Na mijn opleiding ben ik volledig gefocust op het creëren van moderne, schaalbare
                   web applicaties die zowel gebruiksvriendelijk als technisch uitstekend zijn.`,

    passion: `Wat mij echt motiveert is het transformeren van complexe business requirements naar
              elegante, intuïtieve oplossingen. Ik hou van de uitdaging om nieuwe technologieën te
              leren en toe te passen, en ik geloof sterk in clean code principles en best practices.`,

    approach: `Mijn aanpak is altijd gebruikersgericht - ik begin met het begrijpen van de behoeften
               van eindgebruikers en bouw vervolgens robuuste systemen die deze behoeften effectief
               adresseren. Ik werk graag in teams waar kennis delen en continu leren centraal staan.`,

    goals: `Momenteel ben ik op zoek naar uitdagende projecten waar ik mijn skills verder kan
            ontwikkelen en waardevolle bijdragen kan leveren aan innovatieve softwareoplossingen.
            Ik ben vooral geïnteresseerd in posities waar Angular en .NET centraal staan.`,
  };

  protected skillCategories: SkillCategory[] = [
    {
      name: 'Frontend Development',
      icon: 'web',
      skills: [
        { name: 'Angular', level: 90, experience: '2+ jaar' },
        { name: 'TypeScript', level: 95, experience: '2+ jaar' },
        { name: 'JavaScript', level: 85, experience: '3+ jaar' },
        { name: 'HTML5 & CSS3', level: 95, experience: '3+ jaar' },
        { name: 'SCSS/Sass', level: 90, experience: '2+ jaar' },
        { name: 'Angular Material', level: 85, experience: '2+ jaar' },
        { name: 'RxJS', level: 80, experience: '1+ jaar' },
        { name: 'Responsive Design', level: 90, experience: '2+ jaar' },
      ],
    },
    {
      name: 'Backend Development',
      icon: 'storage',
      skills: [
        { name: '.NET Core', level: 85, experience: '2+ jaar' },
        { name: 'C#', level: 90, experience: '2+ jaar' },
        { name: 'ASP.NET Web API', level: 85, experience: '2+ jaar' },
        { name: 'Entity Framework', level: 80, experience: '1+ jaar' },
        { name: 'RESTful APIs', level: 85, experience: '2+ jaar' },
        {
          name: 'Authentication & Authorization',
          level: 75,
          experience: '1+ jaar',
        },
        { name: 'LINQ', level: 85, experience: '2+ jaar' },
      ],
    },
    {
      name: 'Database & Data',
      icon: 'database',
      skills: [
        { name: 'PostgreSQL', level: 80, experience: '1+ jaar' },
        { name: 'SQL Server', level: 75, experience: '1+ jaar' },
        { name: 'SQL', level: 85, experience: '2+ jaar' },
        { name: 'Database Design', level: 75, experience: '1+ jaar' },
        { name: 'Data Modeling', level: 70, experience: '1+ jaar' },
      ],
    },
    {
      name: 'Tools & Workflow',
      icon: 'build',
      skills: [
        { name: 'Git & GitHub', level: 90, experience: '3+ jaar' },
        { name: 'Visual Studio Code', level: 95, experience: '3+ jaar' },
        { name: 'Visual Studio', level: 85, experience: '2+ jaar' },
        { name: 'NPM/Yarn', level: 85, experience: '2+ jaar' },
        { name: 'Azure DevOps', level: 70, experience: '<1 jaar' },
        { name: 'Docker', level: 65, experience: '<1 jaar' },
        { name: 'Postman', level: 85, experience: '2+ jaar' },
      ],
    },
  ];

  protected experiences: Experience[] = [
    {
      title: 'Junior Full-Stack Developer',
      company: 'Eigen Projecten',
      period: '2023 - Heden',
      description:
        'Zelfstandige ontwikkeling van diverse web applicaties om praktische ervaring op te doen en vaardigheden te ontwikkelen.',
      technologies: [
        'Angular',
        'TypeScript',
        '.NET Core',
        'C#',
        'PostgreSQL',
        'SCSS',
      ],
    },
    {
      title: 'Software Development Student',
      company: 'Hogeschool',
      period: '2021 - 2023',
      description:
        'Intensive studie van moderne software development praktijken met focus op web development en enterprise applicaties.',
      technologies: ['C#', '.NET', 'JavaScript', 'SQL', 'HTML/CSS', 'Git'],
    },
  ];

  protected education: Education[] = [
    {
      degree: 'Bachelor Software Development',
      institution: 'Hogeschool Nederland',
      period: '2021 - 2023',
      description:
        'Afgestudeerd met focus op modern web development, software architecture en best practices.',
    },
    {
      degree: 'Diverse Online Certificeringen',
      institution: 'Pluralsight, Udemy, Microsoft Learn',
      period: '2023 - Heden',
      description:
        'Voortdurende professionele ontwikkeling door online cursussen en certificeringen.',
    },
  ];

  protected downloadDutchCV(): void {
    const link = document.createElement('a');
    link.href = '/assets/documents/luc-joosten-cv.pdf';
    link.download = 'cv-luc-joosten.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  protected downloadEnglishCV(): void {
    const link = document.createElement('a');
    link.href = '/assets/documents/luc-joosten-cv-english.pdf';
    link.download = 'cv-luc-joosten-en.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  protected openExternalLink(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  protected getSkillPercentage(level: number): number {
    return level;
  }

  protected getSkillLevelText(level: number): string {
    if (level >= 90) return 'Expert';
    if (level >= 80) return 'Gevorderd';
    if (level >= 70) return 'Intermediate';
    if (level >= 60) return 'Beginner';
    return 'Lerende';
  }
}
