const InputError = ({ messages = [], className = '' }: { messages?: string[]; className?: string }) => (
   <>
      {messages.length > 0 && (
         <>
            {messages.map((message, index) => (
               <p className={`${className} text-sm tracking-wide text-error`} key={index}>
                  {message}
               </p>
            ))}
         </>
      )}
   </>
);

export default InputError;
