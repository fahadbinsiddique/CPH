import json
import logging
import os
from pywebpush import webpush, WebPushException
from django.conf import settings

logger = logging.getLogger(__name__)


VAPID_PRIVATE_KEY = os.getenv("VAPID_PRIVATE_KEY", "private_key.pem")
VAPID_PUBLIC_KEY = os.getenv("VAPID_PUBLIC_KEY")
VAPID_ADMIN_EMAIL = os.getenv("VAPID_ADMIN_EMAIL", "mailto:admin@cph.com")


email_claim = VAPID_ADMIN_EMAIL if VAPID_ADMIN_EMAIL.startswith("mailto:") else f"mailto:{VAPID_ADMIN_EMAIL}"
VAPID_CLAIMS = {
    "sub": email_claim
}

def send_push_notification(subscription_info, title, body, url="/dashboard"):

    if not VAPID_PRIVATE_KEY or not VAPID_PUBLIC_KEY:
        raise RuntimeError(
            "Push notifications are not configured: set VAPID_PRIVATE_KEY and "
            "VAPID_PUBLIC_KEY in the environment (see .env.example)."
        )

    try:
        payload = json.dumps({
            "title": title,
            "body": body,
            "url": url,
            "icon": "icons/web-app-manifest-192x192.png",
            "badge": "icons/web-app-manifest-192x192.png",
        })

        webpush(
            subscription_info=subscription_info,
            data=payload,
            vapid_private_key=VAPID_PRIVATE_KEY,
            vapid_claims=VAPID_CLAIMS,
        )
        return True
    except WebPushException as ex:
        logger.warning("Push notification failed: %s", ex)
        
        if ex.response and ex.response.status_code in [404, 410]:
            logger.info("Invalid or expired push subscription detected")
        return False
    except Exception as e:
        logger.exception("Unexpected push notification error")
        return False