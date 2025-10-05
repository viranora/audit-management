    package com.example.smartspiritbackend.exception;


    import lombok.RequiredArgsConstructor;
    import com.example.smartspiritbackend.model.ErrorLog;
    import com.example.smartspiritbackend.repository.ErrorLogRepository;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.ExceptionHandler;
    import org.springframework.web.bind.annotation.RestControllerAdvice;
    import org.springframework.web.context.request.WebRequest;

    import java.time.LocalDateTime;
    import java.util.Arrays;

    @RestControllerAdvice
    @RequiredArgsConstructor
    public class GlobalExceptionHandler{

        private final ErrorLogRepository errorLogRepo;

        @ExceptionHandler(Exception.class)
        public ResponseEntity<String> handleAllExceptions(Exception ex, WebRequest request) {
            String stackTrace = Arrays.toString(ex.getStackTrace());

            ErrorLog log = new ErrorLog(null,
                    ex.getMessage(),
                    stackTrace,
                    LocalDateTime.now());

            errorLogRepo.save(log);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Bir hata oluştu: " + ex.getMessage());
        }

        @ExceptionHandler(RuntimeException.class)
        public ResponseEntity<String> handleRuntimeException(RuntimeException ex, WebRequest request) {
            String stackTrace = Arrays.toString(ex.getStackTrace());

            ErrorLog log = new ErrorLog(null,
                    ex.getMessage(),
                    stackTrace,
                    LocalDateTime.now());

            errorLogRepo.save(log);

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Yetkisiz işlem: " + ex.getMessage());
        }
    }
