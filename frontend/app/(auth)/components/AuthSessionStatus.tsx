const AuthSessionStatus = ({ status, className, ...props }) => (
   <>
      {status && (
         <div className={`${className} text-sm font-medium text-green-600`} {...props}>
            {status}
         </div>
      )}
   </>
);

export default AuthSessionStatus;
