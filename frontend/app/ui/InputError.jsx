const InputError = ({ messages = [], className = '' }) => (
   <>
      {messages.length > 0 && (
         <>
            {messages.map((message, index) => (
               <p className={`${className} text-sm text-error tracking-wide`} key={index}>
                  {message}
               </p>
            ))}
         </>
      )}
   </>
);

export default InputError;
