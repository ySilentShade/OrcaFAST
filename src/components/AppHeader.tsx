import React from 'react';

const AppHeader: React.FC = () => {
  return (
    <header className="py-8 text-center">
      <h1 className="text-5xl font-bold text-primary">FastFilms</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        Crie orçamentos profissionais de forma rápida e fácil.
      </p>
    </header>
  );
};

export default AppHeader;
