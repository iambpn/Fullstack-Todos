type inpError = {
  name: string;
  msg: string;
};

type returnType =
  | {
      type: 'client';
      error: inpError[];
    }
  | {
      type: 'server';
      error: string;
    };

export default function ReqErrorResolver() {
  const resolver = (e: any, inputNames: String[]): returnType => {
    try {
      let errors = e.response.data.errors;

      if (errors.type) {
        return {
          type: 'server',
          error: errors.msg,
        };
      } else {
        let inpErrors: inpError[] = [];
        for (let name of Object.keys(errors)) {
          if (inputNames.includes(name)) {
            inpErrors.push({
              name,
              msg: errors[name].msg,
            });
          }
        }

        return {
          type: 'client',
          error: inpErrors,
        };
      }
    } catch {
      return {
        type: 'server',
        error: 'Something went wrong.',
      };
    }
  };

  return { resolver };
}
