const hasRole = (user, role) => {
  // Adiciona o prefixo 'ROLE_' à role fornecida
  const roleWithPrefix = `ROLE_${role.toUpperCase()}`;

  // Verifica se a role com o prefixo está presente nas roles do usuário
  return user.roles.includes(roleWithPrefix);
};

export default hasRole;
